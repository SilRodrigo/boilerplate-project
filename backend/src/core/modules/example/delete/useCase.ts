import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { PrismaExampleRepository } from "../../../repositories";

interface IFactoryParams {
    prismaExampleRepository: PrismaExampleRepository;
}

export interface IExampleDeleteUseCase extends IUseCase<string, void> { }

export default function exampleDeleteUseCaseFactory({
    prismaExampleRepository
}: IFactoryParams): IExampleDeleteUseCase {
    return {
        execute: async (id) => {
            const example = await prismaExampleRepository.findById(id);

            if (!example) {
                throw new Error("Example not found.");
            }

            await prismaExampleRepository.delete(id);

            return withUseCaseResponse(undefined, "Example deleted successfully.");
        }
    };
}
