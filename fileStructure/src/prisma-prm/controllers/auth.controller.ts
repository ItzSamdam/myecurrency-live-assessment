
import AuthService from '../services/auth/auth.service';
import { Request, Response, NextFunction } from 'express';
import BaseController from './base.controller';
import httpStatus from 'http-status';

class AuthController extends BaseController {
    constructor(
        public auth: AuthService,
    ) {
        super();
        this.auth = auth;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const user = await this.auth.loginUser({ email, password });
            return res.status(httpStatus.OK).json({
                statusCode: httpStatus.OK,
                status: "success",
                message: "Login Successful",
                data: user,
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController(new AuthService());