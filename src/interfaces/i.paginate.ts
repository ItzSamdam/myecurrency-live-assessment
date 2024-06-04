import { PrismaClient } from '@prisma/client';


export type AnyModel = keyof PrismaClient;

export type WhereInput<T extends AnyModel> = {
    //@ts-ignore
    where: PrismaClient[T]['where'];
};

export type GenericRecord<T> = {
    [key: string]: T;
};
