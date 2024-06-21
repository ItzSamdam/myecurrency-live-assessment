
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