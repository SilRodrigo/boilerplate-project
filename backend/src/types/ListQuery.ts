export type FilterValue = string | number | boolean | null;

export interface IFieldFilter {
    equals?: FilterValue;
    not?: FilterValue;
    in?: FilterValue[];
    notIn?: FilterValue[];
    lt?: FilterValue;
    lte?: FilterValue;
    gt?: FilterValue;
    gte?: FilterValue;
    contains?: FilterValue;
    startsWith?: FilterValue;
    endsWith?: FilterValue;
    mode?: 'default' | 'insensitive';
}

export type FilterOperator = keyof IFieldFilter;

export const FILTER_OPERATORS: readonly FilterOperator[] = [
    'equals', 'not', 'in', 'notIn',
    'lt', 'lte', 'gt', 'gte',
    'contains', 'startsWith', 'endsWith', 'mode',
];

export type ListFilter<F extends string = string> = Partial<Record<F, FilterValue | IFieldFilter>>;

export type ListOrder<F extends string = string> = Partial<Record<F, 'asc' | 'desc'>>;

export interface IListQuery<F extends string = string> {
    currentPage: number;
    pageSize: number;
    filter?: ListFilter<F>;
    order?: ListOrder<F>;
}
