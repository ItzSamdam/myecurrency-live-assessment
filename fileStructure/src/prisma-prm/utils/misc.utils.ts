// import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/config.config";
import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import axios, { AxiosError, AxiosResponse } from 'axios';
import { logger } from './logger.utils';

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

// add prisma to the Node JS global type
interface CustomNodeJsGlobal extends Global {
    prisma: PrismaClient;
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


// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma =
    global.prisma ||
    new PrismaClient({
        errorFormat: "minimal",
        log: ['info'],
    });

if (config.env === "development") global.prisma = prisma;



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
    excludeGlobal, prisma, getUserInfo, getAdminInfo, HttpRequest
};
