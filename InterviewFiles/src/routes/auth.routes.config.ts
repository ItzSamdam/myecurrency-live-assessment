import BaseRoutesConfig from "./base.routes.config";
import { Application } from "express";
import { GuestRoutePrefix } from "./../config/config.config";
import AuthController from "./../controllers/auth.controller";
import validateRequest from "./../middleware/validateRequest";
import verifyAuth from "./../middleware/jwt/verifyAuth";
import { body } from "express-validator";

class AuthRoutesConfig extends BaseRoutesConfig {
    constructor(app: Application) {
        super(app, "AuthRoutes");
    }

    configureRoutes(): Application {
        this.app
            .route(`${GuestRoutePrefix}/register`)
            .post(
                /**
                 * @swagger
                 * /api/v1/register:
                 *   post:
                 *     summary: Register a new user
                 *     description: Returns a success message for the google auth endpoint
                 *     tags: [Auth]
                 *     requestBody:
                 *      required: true
                 *      content:
                 *       application/json:
                 *          schema:
                 *           type: object
                 *           required:
                 *             - username
                 *             - email
                 *             - firstname
                 *             - lastname
                 *             - password
                 *             - refCode
                 *           properties:
                 *            username:
                 *              type: string
                 *              example: 'johndoe'
                 *            email:
                 *              type: string
                 *              example: ' [email protected]'
                 *            firstname:
                 *              type: string
                 *              example: 'John'
                 *            lastname:
                 *              type: string
                 *              example: 'Doe'
                 *            password:
                 *              type: string
                 *              example: 'password'
                 *            refCode:
                 *              type: nullable
                 *              example: 'refcode'
                 *     responses:
                 *       200:
                 *         description: Success message
                 *         content:
                 *           application/json:
                 *             schema:
                 *               type: object
                 *               properties:
                 *                statusCode:
                 *                 type: number
                 *                 example: 200
                 *                status:
                 *                 type: string
                 *                 example: success
                 *                message:
                 *                 type: string
                 *                 example: 'Interview Assessment API API'
                 */
                [
                    body("username").isString().notEmpty().withMessage("Username is required"),
                    body("email").isEmail().notEmpty().withMessage("Email Address is required"),
                    body("firstname").isString().notEmpty().withMessage("Firstname is required"),
                    body("lastname").isString().notEmpty().withMessage("Lastname is required"),
                    body("password")
                        .isStrongPassword({
                            minLength: 8,
                            minLowercase: 1,
                            minUppercase: 1,
                            minNumbers: 1,
                            minSymbols: 1,
                        })
                        .withMessage("Password requirements not met (min 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol)"),
                    body("refCode").optional(),
                ],
                [validateRequest],
                AuthController.registerNewUser.bind(AuthController)
            );

        
        this.app
            .route(`${GuestRoutePrefix}/login`)
            .post(
                /**
                 * @swagger
                 * /api/v1/login:
                 *   post:
                 *     summary: Login a new user
                 *     description: Returns a success message for the google auth endpoint
                 *     tags: [Auth]
                 *     requestBody:
                 *      required: true
                 *      content:
                 *       application/json:
                 *          schema:
                 *           type: object
                 *           required:
                 *             - email
                 *             - password
                 *           properties:
                 *            email:
                 *              type: string
                 *              example: 'johndoe@gmail.com'
                 *            password:
                 *              type: string
                 *              example: 'password'
                 *     responses:
                 *       200:
                 *         description: Success message
                 *         content:
                 *           application/json:
                 *             schema:
                 *               type: object
                 *               properties:
                 *                statusCode:
                 *                 type: number
                 *                 example: 200
                 *                status:
                 *                 type: string
                 *                 example: success
                 *                message:
                 *                 type: string
                 *                 example: 'Interview Assessment API API'
                 */
                [
                    body("email").isEmail().notEmpty().withMessage("Email Address is required"),
                    body("password").isString().notEmpty().withMessage("Password is required"),
                ],
                [validateRequest],
                AuthController.loginUser.bind(AuthController)
        );
        
        // this.app
        //     .route(`${GuestRoutePrefix}/addRefCode`)
        //     .patch(
        //         /**
        //          * @swagger
        //          * /api/v1/addRefCode:
        //          *   patch:
        //          *     summary: Referal Code for a new user
        //          *     description: Returns a success message for the google auth endpoint
        //          *     tags: [Auth]
        //          *     requestBody:
        //          *      required: true
        //          *      content:
        //          *       application/json:
        //          *          schema:
        //          *           type: object
        //          *           required:
        //          *             - referalCode
        //          *           properties:
        //          *            referalCode:
        //          *              type: string
        //          *              example: 'johndoe@gmail.com'
        //          *     responses:
        //          *       200:
        //          *         description: Success message
        //          *         content:
        //          *           application/json:
        //          *             schema:
        //          *               type: object
        //          *               properties:
        //          *                statusCode:
        //          *                 type: number
        //          *                 example: 200
        //          *                status:
        //          *                 type: string
        //          *                 example: success
        //          *                message:
        //          *                 type: string
        //          *                 example: 'Interview Assessment API API'
        //          */
        //         [
        //             body("referalCode").isString().notEmpty().withMessage("referalCode is required"),
        //         ],
        //         [validateRequest, verifyAuth],
        //         AuthController.generateReferral.bind(AuthController)
        // );
        
        this.app
            .route(`${GuestRoutePrefix}/convertPoint`)
            .post(
                /**
                 * @swagger
                 * /api/v1/convertPoint:
                 *   post:
                 *     summary: Referal Code for a new user
                 *     description: Returns a success message for the google auth endpoint
                 *     tags: [Auth]
                 *     requestBody:
                 *      required: true
                 *      content:
                 *       application/json:
                 *          schema:
                 *           type: object
                 *           required:
                 *             - email
                 *             - password
                 *           properties:
                 *            points2Convert:
                 *              type: number
                 *              example: 20
                 *     responses:
                 *       200:
                 *         description: Success message
                 *         content:
                 *           application/json:
                 *             schema:
                 *               type: object
                 *               properties:
                 *                statusCode:
                 *                 type: number
                 *                 example: 200
                 *                status:
                 *                 type: string
                 *                 example: success
                 *                message:
                 *                 type: string
                 *                 example: 'Interview Assessment API API'
                 */
                [
                    body("points2Convert").isNumeric().notEmpty().withMessage("Points2Convert is required"),
                ],
                [validateRequest, verifyAuth],
                AuthController.convertPointToBalance.bind(AuthController)
        );
        
        this.app
            .route(`${GuestRoutePrefix}/withdrawFund`)
            .post(
                /**
                 * @swagger
                 * /api/v1/withdrawFund:
                 *   post:
                 *     summary: Referal Code for a new user
                 *     description: Returns a success message for the google auth endpoint
                 *     tags: [Auth]
                 *     requestBody:
                 *      required: true
                 *      content:
                 *       application/json:
                 *          schema:
                 *           type: object
                 *           required:
                 *             - amount
                 *             - accountNo
                 *           properties:
                 *            amount:
                 *              type: number
                 *              example: 300
                 *            accountNo:
                 *              type: string
                 *              example: '5789098765'
                 *     responses:
                 *       200:
                 *         description: Success message
                 *         content:
                 *           application/json:
                 *             schema:
                 *               type: object
                 *               properties:
                 *                statusCode:
                 *                 type: number
                 *                 example: 200
                 *                status:
                 *                 type: string
                 *                 example: success
                 *                message:
                 *                 type: string
                 *                 example: 'Interview Assessment API API'
                 */
                [
                    body("amount").isNumeric().notEmpty().withMessage("Amount is required"),
                    body("accountNo").isString().notEmpty().withMessage("Account No is required"),
                ],
                [validateRequest, verifyAuth],
                AuthController.withdrawBalance.bind(AuthController)
            );

        return this.app;
    }
}

export default AuthRoutesConfig;