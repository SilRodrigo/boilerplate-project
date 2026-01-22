import { IExample } from "../../../entities/example";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { PrismaExampleRepository } from "../../../repositories";

interface IFactoryParams {
    prismaExampleRepository: PrismaExampleRepository;
}

export interface IExampleFindByIdUseCase extends IUseCase<string, IExample> { }

export default function exampleFindByIdUseCaseFactory({
    prismaExampleRepository
}: IFactoryParams): IExampleFindByIdUseCase {
    return {
        execute: async (id) => {
            const example = await prismaExampleRepository.findById(id);

            if (!example) {
                throw new Error("Example not found.");
            }

            return withUseCaseResponse(example, "Example retrieved successfully.");
        }
    };
}
