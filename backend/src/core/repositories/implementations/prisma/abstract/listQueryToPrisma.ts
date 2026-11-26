import { FILTER_OPERATORS, IFieldFilter, ListFilter, ListOrder } from "../../../../../types/ListQuery";

const isFieldFilter = (value: unknown): value is IFieldFilter =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

export const toPrismaWhere = (filter: ListFilter = {}): Record<string, unknown> => {
    const where: Record<string, unknown> = {};

    for (const [field, value] of Object.entries(filter)) {
        if (value === undefined) continue;

        if (!isFieldFilter(value)) {
            where[field] = { equals: value };
            continue;
        }

        const condition: Record<string, unknown> = {};
        for (const operator of FILTER_OPERATORS) {
            if (value[operator] !== undefined) condition[operator] = value[operator];
        }
        if (Object.keys(condition).length) where[field] = condition;
    }

    return where;
};

export const toPrismaOrderBy = (order: ListOrder = {}): Record<string, 'asc' | 'desc'>[] =>
    Object.entries(order)
        .filter((entry): entry is [string, 'asc' | 'desc'] => entry[1] === 'asc' || entry[1] === 'desc')
        .map(([field, direction]) => ({ [field]: direction }));
