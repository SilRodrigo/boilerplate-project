import { Prisma } from "@prisma/client";

export interface ICreateExampleDto extends Pick<Prisma.ExampleUncheckedCreateInput, 'name'> {
  description?: string;
}

export interface IRequestExampleDto extends Prisma.ExampleGetPayload<{}> { }

export interface IUpdateExampleDto {
  name?: string;
  description?: string;
}

export interface IIncludeExampleDto { }

export interface IFilterExampleDto extends Prisma.ExampleWhereInput { }

export const EXAMPLE_FILTER_FIELDS = ['name', 'description', 'createdAt', 'updatedAt'] as const;

export const EXAMPLE_ORDER_FIELDS = ['name', 'createdAt', 'updatedAt'] as const;

export interface IOrderExampleDto extends Prisma.ExampleOrderByWithRelationInput { }