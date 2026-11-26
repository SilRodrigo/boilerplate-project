import { Prisma } from "@prisma/client";

export interface ICreateUserDto extends Pick<Prisma.UserUncheckedCreateInput, 'email' | 'password' | 'userType'> { }

export interface IRequestUserDto extends Prisma.UserGetPayload<{}> { }

export interface IUpdateUserDto {
  email?: string;
  password?: string;
  userType?: Prisma.UserUncheckedUpdateInput['userType'];
}

export interface IIncludeUserDto { }

export interface IFilterUserDto extends Prisma.UserWhereInput { }

export const USER_FILTER_FIELDS = ['email', 'userType', 'createdAt', 'updatedAt'] as const;

export const USER_ORDER_FIELDS = ['email', 'userType', 'createdAt', 'updatedAt'] as const;

export interface IOrderUserDto extends Prisma.UserOrderByWithRelationInput { }
