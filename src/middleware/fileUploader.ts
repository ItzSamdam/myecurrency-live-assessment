import multer from "multer";
import BadRequestException from "../exceptions/BadRequestException";

/**
 * Checks if the uploaded file is an image or a PDF file.
 * 
 * @param req - The request object.
 * @param file - The file object containing the mimetype.
 * @param cb - The callback function to be called with the result.
 */
const imageFilter = (
    req: any,
    file: { mimetype: string | string[]; },
    cb: (error: Error | null, acceptFile: boolean)
        => void) => {
    if (
        file.mimetype.includes("jpeg") ||
        file.mimetype.includes("png") ||
        file.mimetype.includes("jpg") ||
        file.mimetype.includes("webp") ||
        file.mimetype.includes("pdf")
    ) {
        cb(null, true);
    } else {
        cb(new BadRequestException("Please upload either an image or a PDF file."), false);
    }
};

const storage = multer.memoryStorage();
// @ts-ignore
const VerificationUploader = multer({ storage: storage, fileFilter: imageFilter });

export default VerificationUploader;
