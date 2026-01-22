import { IExample } from "../../../entities/example";
import { IUpdateExampleDto } from "../../../dtos/example";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { PrismaExampleRepository } from "../../../repositories";

interface IFactoryParams {
    prismaExampleRepository: PrismaExampleRepository;
}

export interface IExampleUpdateUseCase extends IUseCase<{ id: string } & IUpdateExampleDto, IExample> { }

export default function exampleUpdateUseCaseFactory({
    prismaExampleRepository
}: IFactoryParams): IExampleUpdateUseCase {
    return {
        execute: async ({ id, ...data }) => {
            const example = await prismaExampleRepository.findById(id);

            if (!example) {
                throw new Error("Example not found.");
            }

            const updatedExample = await prismaExampleRepository.update(id, data);

            return withUseCaseResponse(updatedExample, "Example updated successfully.");
        }
    };
}
