import IErrorMessage from "../interfaces/i.error.message";
import CustomException from "./CustomException";
import httpStatus from "http-status";

class ProviderException extends CustomException {
    public statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    constructor(message: string | null = null) {
        super(message || "Provider Cannot be Reached. Please try again later.");

        Object.setPrototypeOf(this, ProviderException.prototype);
    }

    serialize(): IErrorMessage {
        return {
            statusCode: this.statusCode,
            status: "error",
            message: this.message
        };
    }
}

export default ProviderException;
