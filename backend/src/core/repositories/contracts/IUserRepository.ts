import { IUser } from "../../entities/user";
import { ICreateUserDto, IRequestUserDto, IUpdateUserDto, UserFilterField } from "../../dtos/user";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser, ICreateUserDto, IUpdateUserDto, UserFilterField> {
    findByEmailWithPassword(email: string): Promise<IRequestUserDto | null>;
}
