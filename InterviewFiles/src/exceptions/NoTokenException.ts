import IErrorMessage from "../interfaces/i.error.message";
import CustomException from "./CustomException";
import HttpStatus from "http-status";

class NoTokenException extends CustomException {
    statusCode = HttpStatus.UNAUTHORIZED;

    constructor() {
        super("Authentication Required");

        Object.setPrototypeOf(this, NoTokenException.prototype);
    }

    serialize(): IErrorMessage {
        return {
            statusCode: this.statusCode,
            status: "error",
            message: this.message
        };
    }
}

export default NoTokenException;
