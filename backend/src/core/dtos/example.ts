import { Prisma } from "@prisma/client";
import { ListFilter, ListOrder } from "../../types/ListQuery";

export interface ICreateExampleDto extends Pick<Prisma.ExampleUncheckedCreateInput, 'name'> {
  description?: string;
}

export interface IRequestExampleDto extends Prisma.ExampleGetPayload<{}> { }

export interface IUpdateExampleDto {
  name?: string;
  description?: string;
}

export interface IIncludeExampleDto { }

export const EXAMPLE_FILTER_FIELDS = ['name', 'description', 'createdAt', 'updatedAt'] as const;

export const EXAMPLE_ORDER_FIELDS = ['name', 'createdAt', 'updatedAt'] as const;

export type ExampleFilterField = typeof EXAMPLE_FILTER_FIELDS[number];

export type IFilterExampleDto = ListFilter<ExampleFilterField>;

export type IOrderExampleDto = ListOrder<ExampleFilterField>;