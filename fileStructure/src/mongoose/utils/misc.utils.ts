// import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/config.config";
import { Request } from "express";
import mongoose from "mongoose";
import axios, { AxiosError, AxiosResponse } from 'axios';
import { logger } from './logger.utils';
import BadRequestException from "../exceptions/BadRequestException";

interface Headers {
    [key: string]: string;
}

interface Admin {
    id: string;
    role: string;
}

interface User {
    id: string;
}



//instantiate the cloudinary library
/**
 * @description This is the cloudinary configuration file
 * @param cloud_name
 * @param api_key
 * @param api_secret
 */

// cloudinary.config({
//     cloud_name: config.cloudinary.name,
//     api_key: config.cloudinary.apiKey,
//     api_secret: config.cloudinary.secretKey,
// });


/**
 * Exclude keys from object
 * @param obj
 * @param keys
 * @returns
 */
const excludeGlobal = <Type, Key extends keyof Type>(obj: Type, keys: Key[]): Omit<Type, Key> => {
    for (const key of keys) {
        delete obj[key];
    }
    return obj;
};
// Define a custom global interface to include mongoose
interface CustomNodeJsGlobal extends Global {
    mongoose: typeof mongoose;
}

// Prevent multiple instances of Mongoose in development
declare const global: CustomNodeJsGlobal;

const mongoURI = config.database.url; // Ensure you have the MongoDB URI in your config

if (!mongoURI) {
    throw new BadRequestException('Please define the MONGO_URI environment variable in your config');
}

const dbExport = async () => {
    if (global.mongoose) {
        return global.mongoose;
    }

    try {
        const connection = await mongoose.connect(mongoURI);

        if (config.env === 'development') {
            global.mongoose = connection;
        }

        console.log('Database connected successfully');
        return connection;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};


/**
 * Retrieves the admin information from the request object.
 * @param req - The request object.
 * @returns The admin information.
 */
function getAdminInfo(req: Request): Admin {
    //@ts-ignore
    const { adminId, role } = req.admin;
    let id = adminId;
    return { id, role };
}

/**
 * Retrieves the user information from the request object.
 * @param req - The request object.
 * @returns The user information.
 */
function getUserInfo(req: Request): User {
    //@ts-ignore
    const { userId } = req.user;
    let id = userId;
    return { id };
}



/**
 * Sends an HTTP request to the specified endpoint.
 * @param endPoint - The URL of the endpoint to send the request to.
 * @param method - The HTTP method to use for the request (GET, POST, PUT, DELETE).
 * @param payload - The data to send with the request.
 * @param headers - The headers to include in the request.
 * @returns A Promise that resolves to the AxiosResponse or undefined if an error occurs.
 */
const HttpRequest = async (endPoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', payload: any, headers: Headers): Promise<AxiosResponse<any> | undefined> => {
    try {
        return await axios({
            method,
            url: endPoint,
            data: payload,
            headers
        });
    } catch (error) {
        // @ts-ignore
        return handleAxiosError(error);
    }
};

// @ts-ignore
function handleAxiosError(error: AxiosError): axios.AxiosResponse<unknown, any> | undefined {
    if (error.response) {
        logger.error(error.response);
        return error.response;
    }
    return undefined;
}

export {
    // cloudinary,
    excludeGlobal, dbExport, getUserInfo, getAdminInfo, HttpRequest
};
