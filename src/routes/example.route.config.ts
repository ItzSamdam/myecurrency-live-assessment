// import BaseRoutesConfig from "../base.routes.config";
// import { Application } from "express";
// import { GuestRoutePrefix } from "../../config/config.config";
// import OtherController from "../../controllers/apiControllers/others.controller";
// import validateRequest from "../../middleware/validateRequest";
// import verifyAuth from "../../middleware/jwt/verifyAuth";

// class OtherRoutesConfig extends BaseRoutesConfig {
//     constructor(app: Application) {
//         super(app, "OtherRoutes");
//     }

//     configureRoutes(): Application {
//         this.app
//             .route(`${GuestRoutePrefix}/submit-support-form`)
//             .post(
//                 /**
//                  * @swagger
//                  * /api/v1/submit-support-form:
//                  *   post:
//                  *     summary: Submit a support form
//                  *     description: Returns a success message for the google auth endpoint
//                  *     tags: [Support]
//                  *     requestBody:
//                  *      required: true
//                  *      content:
//                  *       application/json:
//                  *          schema:
//                  *           type: object
//                  *           required:
//                  *             - subject
//                  *             - message
//                  *           properties:
//                  *             subject:
//                  *               type: string
//                  *               default: 'Account MFA Misbehaving'
//                  *               example: 'Account MFA Misbehaving'
//                  *             message:
//                  *               type: string
//                  *               default: 'I am having issues with my MFA'
//                  *               example: 'I am having issues with my MFA'
//                  *     responses:
//                  *       200:
//                  *         description: Success message
//                  *         content:
//                  *           application/json:
//                  *             schema:
//                  *               type: object
//                  *               properties:
//                  *                statusCode:
//                  *                 type: number
//                  *                 example: 200
//                  *                status:
//                  *                 type: string
//                  *                 example: success
//                  *                message:
//                  *                 type: string
//                  *                 example: 'EhYo Communication API'
//                  */
//                 [validateRequest, verifyAuth],
//                 OtherController.submitContactForm.bind(OtherController)
//             );

//         return this.app;
//     }
// }

// export default OtherRoutesConfig;