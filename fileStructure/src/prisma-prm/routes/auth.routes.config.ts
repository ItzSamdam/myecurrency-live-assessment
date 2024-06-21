
import BaseRoutesConfig from "./base.routes.config";
import { Application } from "express";
import { GuestRoutePrefix } from "../config/config.config";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import AuthController from "../controllers/auth.controller";

class AuthRoutesConfig extends BaseRoutesConfig {
    constructor(app: Application) {
        super(app, "AuthRoutes");
    }

    configureRoutes(): Application {

        this.app
            .route(`${GuestRoutePrefix}/login`)
            .post(
                [
                    body("email").isEmail().withMessage("Email is required"),
                    body("password").isString().withMessage("Password is required")
                ],
                [validateRequest],
                AuthController.login.bind(AuthController),
            );

        return this.app;
    }
}

export default AuthRoutesConfig;
