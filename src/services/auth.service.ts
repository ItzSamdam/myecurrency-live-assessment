
//note 10 pojts
//credit inw allet
//point to be conveted to balance

import BaseService from "./base.service";
import { excludeGlobal, prisma } from "../utils/misc.utils";
import BadRequestException from "../exceptions/BadRequestException";
import { comparePassword, hashPassword } from "../config/globalSecure.config"
import { generateAuthToken } from "../middleware/jwt/generateAuthToken"
import { accounts, transferFund } from "../utils/myecurrency.utils";

class AuthService extends BaseService {
    constructor() {
        super()
    }

    async register(data: {
        username: string,
        email: string, firstname: string, lastname: string, password: string, refCode?: string
    }) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }]
            }
        })
        if (user) {
            throw new BadRequestException("User Already Exist");
        }

        const newUser = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                firstname: data.firstname,
                lastname: data.lastname,
                password: await hashPassword(data.password),
                referalCode: await this.generateRefCode(data.username)
            }
        })

        if (!newUser) {
            throw new BadRequestException("Oop! Couldnt not create user account");
        }

        if (data.refCode != null && data.refCode != "") {
            const refData = { referalCode: data?.refCode, referUserId: newUser.id }
            await this.handleReferral(refData);
        }
        //generate token for auth
        const tken = await generateAuthToken(newUser.id)
        //exxclude passwrd from response
        const userData = excludeGlobal(newUser, ["password"]);
        return {
            user: userData,
            token: tken
        }
    }

    async login(data: { email: string, password: string }) {
        //due to the orm i applied, findUnique is case sensitive.
        //i can use findFirst with mode insensitive to make it case insensitive
        //findFirst may not enforce unique constraints; 
        //it will return the first match it finds, which might not be the only record
        //if there are multiple records matching the condition(though ideally, the email field should be unique).
        //Slightly less performant compared to findUnique due to the potential for more flexible searching.
        //NB: This is particular to Prisma ORM
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: data.email,
                    mode: "insensitive"
                }
            }
        })
        if (!user) {
            throw new BadRequestException("Invalid Credentials");
        }
        const checkPass = await comparePassword(data.password, user.password);
        if (!checkPass) {
            throw new BadRequestException("Invalid Credentials");
        }
        //generate token for auth
        const tken = await generateAuthToken(user.id)
        //exxclude passwrd from response
        const userData = excludeGlobal(user, ["password"]);
        return {
            user: userData,
            token: tken
        }
    }

    async generateRefCode(username: string) {
        let refCode: string;
        let checkRefCode: any;
        do {
            refCode = username + Math.floor(1000 + Math.random() * 9000);
            checkRefCode = await prisma.user.findFirst({
                where: { referalCode: refCode }
            });
        } while (checkRefCode);
        return refCode;
    }

    async convertRefPoints(data: { userId: string, points2Convert: number }) {
        const checkUserPoint = await prisma.user.findUnique({
            where: { id: data.userId }
        })
        if (!checkUserPoint || checkUserPoint.referalPoint == 0) {
            throw new BadRequestException("No referal point yet, please refer a user")
        }
        if (data.points2Convert <= 0) {
            throw new BadRequestException("Invalid Point to convert");
        }
        if (checkUserPoint.referalPoint < data.points2Convert) {
            throw new BadRequestException("Insufficient Point Balance.");
        }
        //convert point to balance
        const pointsToAdd = 10 * data.points2Convert;
        await prisma.user.update({
            where: { id: data.userId },
            data: {
                balance: checkUserPoint.balance + pointsToAdd,
                referalPoint: checkUserPoint.referalPoint - data.points2Convert
            }
        })
        return true;
    }

    async handleReferral(data: { referalCode: string, referUserId: string }) {
        const referringUser = await prisma.user.findFirst({
            where: { referalCode: data.referalCode }
        })
        if (!referringUser) {
            console.log("invalid ref")
            return false;
        }
        await prisma.referal.create({
            data: {
                referalCode: data.referalCode,
                referrerUser: data.referUserId
            }
        })
        const pointToadd = 10;
        await prisma.user.update({
            where: {
                id: referringUser.id
            },
            data: {
                referalPoint: { increment: pointToadd }
            }
        })
        return true;
    }

    async handleWithraw(data: { userId: string, amount: number, accountNo: string }) {
        return await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.findUnique({
                where: { id: data.userId }
            });
            if (!user) {
                throw new BadRequestException("Invalid User Account");
            }
            // Return error if amount is less than 50
            if (data.amount < 50.00 || data.amount > 9999.99) {
                throw new BadRequestException("You can not withdraw less than NGN50.00 and more than NGN9,999.99");
            }
            if (data.amount > user.balance) {
                throw new BadRequestException("Insufficient Balance to process withdrawal");
            }
            // Deduct the amount from the user's balance
            const updatedUser = await prisma.user.update({
                where: { id: data.userId },
                data: {
                    balance: {
                        decrement: data.amount,
                    },
                },
            });
            const transfer = await this.validateAccountAndTransfer({
                accountNo: data.accountNo, // Assuming the transfer account is passed in data
                amount: data.amount,
            });
            return { updatedUser, transfer };
        });
    }

    async validateAccountAndTransfer(data: { accountNo: string, amount: number }) {
        const accountExists = accounts.data.find(account => account.account_no === data.accountNo);

        if (!accountExists) {
            throw new BadRequestException("Invalid Account No Provided...");
        }
        //trnafser fund
        const transferData = {
            amount: data.amount,
            account_no: data.accountNo,
            bank_code: accountExists.bank_code

        }
        return await transferFund(transferData);
    }
}

export default AuthService;