import { IExample } from "../../../entities/example";
import { IFilterExampleDto, IOrderExampleDto } from "../../../dtos/example";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { PrismaExampleRepository } from "../../../repositories";
import { IPaginationParams, IPaginationResult } from "../../../../helpers/pagination";

interface IFactoryParams {
    prismaExampleRepository: PrismaExampleRepository;
}

export interface IExampleListUseCase extends IUseCase<
    IPaginationParams & { filter?: IFilterExampleDto } & { order?: IOrderExampleDto },
    IPaginationResult<IExample>
> { }

export default function exampleListUseCaseFactory({
    prismaExampleRepository
}: IFactoryParams): IExampleListUseCase {
    return {
        execute: async ({ currentPage, pageSize, filter, order }) => {
            const result = await prismaExampleRepository.findByFilter({
                currentPage,
                pageSize,
                filter: filter,
                order: order,
            });

            return withUseCaseResponse(result, "Examples retrieved successfully.");
        }
    };
}
