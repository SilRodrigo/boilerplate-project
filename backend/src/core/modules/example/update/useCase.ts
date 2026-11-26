import { IExample } from "../../../entities/example";
import { IUpdateExampleDto } from "../../../dtos/example";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { IExampleRepository } from "../../../repositories";

interface IFactoryParams {
    exampleRepository: IExampleRepository;
}

export interface IExampleUpdateUseCase extends IUseCase<{ id: string } & IUpdateExampleDto, IExample> { }

export default function exampleUpdateUseCaseFactory({
    exampleRepository
}: IFactoryParams): IExampleUpdateUseCase {
    return {
        execute: async ({ id, ...data }) => {
            const example = await exampleRepository.findById(id);

            if (!example) {
                throw new Error("Example not found.");
            }

            const updatedExample = await exampleRepository.update(id, data);

            return withUseCaseResponse(updatedExample, "Example updated successfully.");
        }
    };
}
