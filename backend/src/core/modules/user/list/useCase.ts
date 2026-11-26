import { IUser } from "../../../entities/user";
import { IFilterUserDto, IOrderUserDto } from "../../../dtos/user";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { IUserRepository } from "../../../repositories";
import { IPaginationParams, IPaginationResult } from "../../../../helpers/pagination";

interface IFactoryParams {
    userRepository: IUserRepository;
}

export interface IUserListUseCase extends IUseCase<
    IPaginationParams & { filter?: IFilterUserDto } & { order?: IOrderUserDto },
    IPaginationResult<IUser>
> { }

export default function userListUseCaseFactory({
    userRepository
}: IFactoryParams): IUserListUseCase {
    return {
        execute: async ({ currentPage, pageSize, filter, order }) => {
            const result = await userRepository.findByFilter({
                currentPage,
                pageSize,
                filter,
                order: order && Object.keys(order).length ? order : { createdAt: 'desc' },
            });

            return withUseCaseResponse(result, "Users retrieved successfully.");
        }
    };
}
