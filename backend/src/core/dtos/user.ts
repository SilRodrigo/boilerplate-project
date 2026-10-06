import { Prisma } from "@prisma/client";

export interface ICreateUserDto extends Pick<Prisma.UserUncheckedCreateInput, 'email' | 'password' | 'userType'> { }

export interface IRequestUserDto extends Prisma.UserGetPayload<{}> { }

export interface IUpdateUserDto {
  email?: string;
  password?: string;
  userType?: Prisma.UserUncheckedUpdateInput['userType'];
}

export interface IIncludeUserDto { }
