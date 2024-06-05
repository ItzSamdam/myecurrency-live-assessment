
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
                password: await hashPassword(data.password)
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
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
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

    async generateRefCode(data: { refCode: string, userId: string }) {
        const checkRefCode = await prisma.user.findFirst({
            where: {
                referalCode: data.refCode
            }
        })
        if (checkRefCode) {
            throw new BadRequestException("RefCode In Use. Please use another")
        }
        //check to avoid change in ref code after first change
        const checkRef = await prisma.user.findUnique({
            where: { id: data.userId }
        })
        if (checkRef && checkRef.referalCode == null) {
            const saveCode = await prisma.user.update({
                where: {
                    id: data.userId
                },
                data: {
                    referalCode: data.refCode
                }
            })

            return !!saveCode;
        }
        throw new BadRequestException("Can Only Generate Ref Code Once")
    }

    async convertRefPoints(data: { userId: string }) {
        const checkUserPoint = await prisma.user.findUnique({
            where: { id: data.userId }
        })
        if (!checkUserPoint || checkUserPoint.referalPoint == 0) {
            throw new BadRequestException("No referal point yet, please refer a user")
        }
        //convert point to balance
        const pointsToAdd = 10 * checkUserPoint.referalPoint;
        await prisma.user.update({
            where: { id: data.userId },
            data: {
                balance: checkUserPoint.balance + pointsToAdd,
                referalPoint: 0
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
        const pointToadd = 1;
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
            
            if (data.amount > user.balance) {
                throw new BadRequestException("Insufficient Balance");
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

            try {
                // Handle transfer and account check
                const transfer = await this.validateAccountAndTransfer({
                    accountNo: data.accountNo, // Assuming the transfer account is passed in data
                    amount: data.amount,
                });

                return { updatedUser, transfer };
            } catch (error) {
                console.log(error)
                throw new BadRequestException("Transfer failed");
            }
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