import { IUser } from "../../../entities/user";
import { IFilterUserDto, IOrderUserDto } from "../../../dtos/user";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { PrismaUserRepository } from "../../../repositories";
import { IPaginationParams, IPaginationResult } from "../../../../helpers/pagination";

interface IFactoryParams {
    prismaUserRepository: PrismaUserRepository;
}

export interface IUserListUseCase extends IUseCase<
    IPaginationParams & { filter?: IFilterUserDto } & { order?: IOrderUserDto },
    IPaginationResult<IUser>
> { }

export default function userListUseCaseFactory({
    prismaUserRepository
}: IFactoryParams): IUserListUseCase {
    return {
        execute: async ({ currentPage, pageSize, filter, order }) => {
            const result = await prismaUserRepository.findByFilter({
                currentPage,
                pageSize,
                filter,
                order: order && Object.keys(order).length ? order : { createdAt: 'desc' },
            });

            return withUseCaseResponse(result, "Users retrieved successfully.");
        }
    };
}
