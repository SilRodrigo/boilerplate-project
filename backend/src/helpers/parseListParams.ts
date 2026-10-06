export interface IPaginationQueryParams {
    page?: string | number;
    pageSize?: string | number;
    filter?: string;
    order?: string;
}

export interface IParsedListParams<T = any> {
    currentPage: number;
    pageSize: number;
    filter: T;
    order?: any;
}

export interface IListParamsOptions {
    /** Fields the client may filter by. Anything else is dropped. */
    filterFields?: readonly string[];
    /** Fields the client may order by. Anything else is dropped. */
    orderFields?: readonly string[];
    defaultPageSize?: number;
    maxPageSize?: number;
}

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MAX_IN_LENGTH = 100;

// Prisma scalar filter operators the client is allowed to use
const ALLOWED_OPERATORS = new Set([
    'equals', 'not', 'in', 'notIn',
    'lt', 'lte', 'gt', 'gte',
    'contains', 'startsWith', 'endsWith', 'mode',
]);

const isPrimitive = (value: unknown) =>
    value === null || ['string', 'number', 'boolean'].includes(typeof value);

const toPositiveInt = (value: unknown, fallback: number) => {
    const parsed = Math.floor(Number(value));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseJson = (value: unknown, label: string): unknown => {
    if (typeof value !== 'string') return value;

    try {
        return JSON.parse(value);
    } catch (error) {
        console.error(`Error parsing ${label}:`, error);
        return {};
    }
};

const sanitizeFieldFilter = (value: unknown): unknown => {
    if (isPrimitive(value)) return value;
    if (typeof value !== 'object' || Array.isArray(value)) return undefined;

    const sanitized: Record<string, unknown> = {};

    for (const [operator, operand] of Object.entries(value as object)) {
        if (!ALLOWED_OPERATORS.has(operator)) continue;

        if (operator === 'in' || operator === 'notIn') {
            if (Array.isArray(operand) && operand.length <= MAX_IN_LENGTH && operand.every(isPrimitive)) {
                sanitized[operator] = operand;
            }
        } else if (operator === 'mode') {
            if (operand === 'insensitive' || operand === 'default') sanitized[operator] = operand;
        } else if (isPrimitive(operand)) {
            sanitized[operator] = operand;
        }
    }

    return Object.keys(sanitized).length ? sanitized : undefined;
};

const sanitizeFilter = (filter: unknown, allowedFields: readonly string[]) => {
    const sanitized: Record<string, unknown> = {};
    if (!filter || typeof filter !== 'object' || Array.isArray(filter)) return sanitized;

    for (const [field, value] of Object.entries(filter)) {
        if (!allowedFields.includes(field)) continue;

        const fieldFilter = sanitizeFieldFilter(value);
        if (fieldFilter !== undefined) sanitized[field] = fieldFilter;
    }

    return sanitized;
};

const sanitizeOrder = (order: unknown, allowedFields: readonly string[]) => {
    const sanitized: Record<string, 'asc' | 'desc'> = {};
    if (!order || typeof order !== 'object' || Array.isArray(order)) return sanitized;

    for (const [field, direction] of Object.entries(order)) {
        if (allowedFields.includes(field) && (direction === 'asc' || direction === 'desc')) {
            sanitized[field] = direction;
        }
    }

    return sanitized;
};

export const parseListParams = <T = any>(
    queryParams: IPaginationQueryParams,
    {
        filterFields = [],
        orderFields = [],
        defaultPageSize = DEFAULT_PAGE_SIZE,
        maxPageSize = MAX_PAGE_SIZE,
    }: IListParamsOptions = {}
): IParsedListParams<T> => {
    const { page = 1, pageSize = defaultPageSize, filter = '{}', order = '{}' } = queryParams;

    return {
        currentPage: toPositiveInt(page, 1),
        pageSize: Math.min(toPositiveInt(pageSize, defaultPageSize), maxPageSize),
        filter: sanitizeFilter(parseJson(filter, 'filter'), filterFields) as T,
        order: sanitizeOrder(parseJson(order, 'order'), orderFields),
    };
};
