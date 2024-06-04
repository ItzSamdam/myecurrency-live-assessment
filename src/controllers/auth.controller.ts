import { Request, Response, NextFunction } from 'express';
import BaseContoller from './base.controller';
import httpStatus from 'http-status';
import AuthService from '../services/auth.service';
import { getUserInfo } from '../utils/misc.utils';
import NoTokenException from '../exceptions/NoTokenException';

class AuthController extends BaseContoller {
    constructor(public authService: AuthService) {
        super() 
        
        this.authService = authService;
    }

    private getUserId(req: Request) {
        const { id } = getUserInfo(req);
        if (!id) {
            throw new NoTokenException();
        }
        return { id };
    }


    async registerNewUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, firstname, lastname, password, refCode } = req.body;
            const data = { username, email, firstname, lastname, password, refCode }
            const user = await this.authService.register(data);
            return res.status(httpStatus.CREATED).json({
                status: 'success',
                statusCode: httpStatus.CREATED,
                message: "User created successfully",
                data: user
            });
        } catch (error) {
            next(error)
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            const data = { username, password }
            const user = await this.authService.login(data);
            return res.status(httpStatus.OK).json({
                status: 'success',
                statusCode: httpStatus.OK,
                message: "User logged in successfully",
                data: user
            });
        } catch (error) {
            next(error)
        }
    }

    async generateReferral(req: Request, res: Response, next: NextFunction) {
        try {
            const { referalCode } = req.body;

            const { id } = this.getUserId(req);
            const data = { refCode: referalCode, userId: id }
            const referral = await this.authService.generateRefCode(data);
            return res.status(httpStatus.OK).json({
                status: 'success',
                statusCode: httpStatus.OK,
                message: "Referral Code Updated successfully",
                data: referral
            });
        } catch (error) {
            next(error)
        }
    }

    async convertPointToBalance(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = this.getUserId(req);
            const data = { userId: id };
            const referral = await this.authService.convertRefPoints(data);
            return res.status(httpStatus.OK).json({
                status: 'success',
                statusCode: httpStatus.OK,
                message: "Referral Point Converted",
                data: referral
            });
        } catch (error) {
            next(error)
        }
    }

    async withdrawBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const { amount, accountNo } = req.body;
            const { id } = this.getUserId(req);
            const data = { userId: id, amount, accountNo };
            const referral = await this.authService.handleWithraw(data);
            return res.status(httpStatus.OK).json({
                status: 'success',
                statusCode: httpStatus.OK,
                message: "Withdrawal Successful",
                data: referral
            });
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController(new AuthService());