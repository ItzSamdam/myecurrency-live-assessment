import { UseCase } from '@prisma/client';
import {prisma} from './misc.utils';
import { logger } from './logger.utils';
class OneTimePass {

    /**
     * Checks if a user has a one-time pass for a specific identifier and use case.
     * @param identifier - The identifier of the user.
     * @param useCase - The use case for the one-time pass.
     * @returns The one-time pass if found, otherwise null.
     */
    async hasOneTimePass(identifier: string, useCase: UseCase) {
        try {
            const oneTimePass = await prisma.oneTimePass.findFirst({
                where: {
                    identifier: identifier,
                    useCase,
                },
            });
            return oneTimePass;
        } catch (error) {
            logger.error('Failed to check for one-time pass', error);
            return null;
        }
    }

    /**
     * Creates a one-time pass for the given identifier and use case.
     * @param identifier - The identifier for the one-time pass.
     * @param useCase - The use case for the one-time pass.
     * @returns The created one-time pass.
     */
    async createOneTimePass(identifier: string, useCase: UseCase) {
        try {
            //check for existing data with the same identifier and useCase
            const otp = await this.otp(6);
            const oneTimePass = await prisma.oneTimePass.upsert({
                where: {
                    id: identifier,
                    useCase: useCase,
                },
                update: {
                    otp,
                    expiryTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
                },
                create: {
                    identifier,
                    useCase,
                    otp,
                    expiryTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
                },
            });
            return oneTimePass;
        } catch (error) {
            logger.error('Failed to create one-time pass', error);
            return null;
        }
    }

    /**
     * Verifies a one-time pass for a given identifier, OTP, and use case.
     * @param identifier - The identifier associated with the one-time pass.
     * @param otp - The one-time pass to be verified.
     * @param useCase - The use case for which the one-time pass is being verified.
     * @returns A boolean indicating whether the one-time pass is valid or not.
     */
    async verifyOneTimePass(identifier: string, otp: string, useCase: UseCase) {
        try {
            const oneTimePass = await prisma.oneTimePass.findFirst({
                where: {
                    identifier: identifier,
                    useCase,
                    otp,
                    // Check if the expiry time has not passed
                    expiryTime: {
                        gte: new Date(),
                    },
                },
            });
            //return true if oneTimePass is not null and
            //if the expiry time has not passed else return false
            return oneTimePass !== null;
        } catch (error) {
            logger.error('Failed to verify one-time pass', error);
            return false;
        }
    }

    /**
     * Deletes a one-time pass from the database.
     * 
     * @param identifier - The identifier of the one-time pass.
     * @param useCase - The use case of the one-time pass.
     * @returns A boolean indicating whether the deletion was successful.
     */
    async deleteOneTimePass(identifier: string, useCase: UseCase) {
        try {
            await prisma.oneTimePass.deleteMany({
                where: {
                    identifier: identifier,
                    useCase,
                },
            });
            return true;
        } catch (error) {
            logger.error('Failed to delete one-time pass', error);
            return false;
        }
    }

    /**
     * Generates a one-time password (OTP) of the specified length.
     * @param length The length of the OTP to generate.
     * @returns The generated OTP.
     */
    async otp(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return otp;
    }
    //example of otp

}

export default OneTimePass;