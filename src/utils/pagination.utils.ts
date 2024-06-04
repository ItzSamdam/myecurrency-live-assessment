import { PrismaClient } from '@prisma/client';
import { AnyModel, WhereInput, GenericRecord } from '../interfaces/i.paginate';

/**
 * Paginates the records of a given model using Prisma.
 * 
 * @template T - The type of the model.
 * @param {PrismaClient} prisma - The Prisma client instance.
 * @param {T} model - The model to paginate.
 * @param {WhereInput<T>} query - The query to filter the records.
 * @param {number} [page=1] - The current page number.
 * @param {number} [pageSize=20] - The number of records per page.
 * @param {GenericRecord<any>} [otherQueryArgs] - Additional query arguments.
 * @returns {Promise<{
 *     currentPage: number,
 *     totalPages: number,
 *     hasNextPage: boolean,
 *     hasPrevPage: boolean,
 *     nextPage: number | null,
 *     prevPage: number | null,
 *     record: T[]
 * }>} - The paginated result.
 */
export async function paginate<T extends AnyModel>(
    prisma: PrismaClient,
    model: T,
    query: WhereInput<T>,
    page: number = 1,
    pageSize: number = 20,
    otherQueryArgs?: GenericRecord<any>
) {
    const skip = (page - 1) * pageSize;
    //@ts-ignore
    const record = await prisma[model].findMany({
        where: query.where,
        ...otherQueryArgs,
        orderBy: {
            createdAt: 'desc',
        },
        skip,
        take: pageSize,
    });

    //@ts-ignore
    const totalCount = await prisma[model].count({ where: query.where });
    const totalPages = Math.ceil(totalCount / pageSize);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
        record,
    };
}

export async function otherPaginator(
    data: any,
    page: number = 1,
    pageSize: number = 20,
) {

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const paginatedData = data.slice(startIndex, endIndex);

    return {
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
        record: paginatedData,
    };

}