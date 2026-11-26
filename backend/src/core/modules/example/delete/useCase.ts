import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { IExampleRepository } from "../../../repositories";

interface IFactoryParams {
    exampleRepository: IExampleRepository;
}

export interface IExampleDeleteUseCase extends IUseCase<string, void> { }

export default function exampleDeleteUseCaseFactory({
    exampleRepository
}: IFactoryParams): IExampleDeleteUseCase {
    return {
        execute: async (id) => {
            const example = await exampleRepository.findById(id);

            if (!example) {
                throw new Error("Example not found.");
            }

            await exampleRepository.delete(id);

            return withUseCaseResponse(undefined, "Example deleted successfully.");
        }
    };
}
