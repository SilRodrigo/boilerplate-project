import { IExample } from "../../../entities/example";
import { ICreateExampleDto, IFilterExampleDto } from "../../../dtos/example";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { IExampleRepository } from "../../../repositories";

interface IFactoryParams {
    exampleRepository: IExampleRepository;
}

export interface IExampleCreateUseCase extends IUseCase<ICreateExampleDto, IExample> { }

export default function exampleCreateUseCaseFactory({
    exampleRepository
}: IFactoryParams): IExampleCreateUseCase {
    return {
        execute: async (data) => {
            if (data.name) {
                const filter: IFilterExampleDto = { name: data.name };
                const result = await exampleRepository.findByFilter({ currentPage: 1, pageSize: 1, filter });
                const [exampleExists] = result.items;

                if (exampleExists) {
                    throw new Error("Example with this name already exists.");
                }
            }

            const example = await exampleRepository.create(data);

            return withUseCaseResponse(example, "Example created successfully.");
        }
    };
}
