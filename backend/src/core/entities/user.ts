import { IRequestUserDto } from "../dtos";

export type UserType = 'ADMIN' | 'USER';

// The password hash never leaves the repository layer through this entity
export interface IUser {
    id: string;
    email: string;
    userType: UserType;
    createdAt: Date;
    updatedAt: Date;
}

export const userFactory = (requestUserDto: IRequestUserDto): IUser => {
    const user: IUser = {
        id: requestUserDto.id,
        email: requestUserDto.email,
        userType: requestUserDto.userType,
        createdAt: requestUserDto.createdAt,
        updatedAt: requestUserDto.updatedAt,
    };

    return user;
};
