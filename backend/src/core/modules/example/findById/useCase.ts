import { IExample } from "../../../entities/example";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { IExampleRepository } from "../../../repositories";

interface IFactoryParams {
    exampleRepository: IExampleRepository;
}

export interface IExampleFindByIdUseCase extends IUseCase<string, IExample> { }

export default function exampleFindByIdUseCaseFactory({
    exampleRepository
}: IFactoryParams): IExampleFindByIdUseCase {
    return {
        execute: async (id) => {
            const example = await exampleRepository.findById(id);

            if (!example) {
                throw new Error("Example not found.");
            }

            return withUseCaseResponse(example, "Example retrieved successfully.");
        }
    };
}
