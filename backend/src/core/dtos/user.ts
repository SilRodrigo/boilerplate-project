import { Prisma } from "@prisma/client";
import { ListFilter, ListOrder } from "../../types/ListQuery";

export interface ICreateUserDto extends Pick<Prisma.UserUncheckedCreateInput, 'email' | 'password' | 'userType'> { }

export interface IRequestUserDto extends Prisma.UserGetPayload<{}> { }

export interface IUpdateUserDto {
  email?: string;
  password?: string;
  userType?: Prisma.UserUncheckedUpdateInput['userType'];
}

export interface IIncludeUserDto { }

export const USER_FILTER_FIELDS = ['email', 'userType', 'createdAt', 'updatedAt'] as const;

export const USER_ORDER_FIELDS = ['email', 'userType', 'createdAt', 'updatedAt'] as const;

export type UserFilterField = typeof USER_FILTER_FIELDS[number];

export type IFilterUserDto = ListFilter<UserFilterField>;

export type IOrderUserDto = ListOrder<UserFilterField>;
