import CvmFundDocumentsRepository, { IFundDocument } from "../../../repositories/implementations/external/CvmFundDocumentsRepository";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";

export interface IFundDocumentsParams {
    ticker: string;
    month: string;
}

interface IFactoryParams {
    externalCvmFundDocumentsRepository: CvmFundDocumentsRepository;
}

export interface IFundDocumentsUseCase extends IUseCase<IFundDocumentsParams, IFundDocument[]> { }

export default function fundDocumentsUseCaseFactory({
    externalCvmFundDocumentsRepository
}: IFactoryParams): IFundDocumentsUseCase {
    return {
        execute: async ({ ticker, month }) => {
            if (!/^\d{4}-\d{2}$/.test(month)) {
                throw new Error("Month must use YYYY-MM format.");
            }

            const documents = await externalCvmFundDocumentsRepository.findByMonth({ ticker, month });

            return withUseCaseResponse(documents, "Fund documents retrieved successfully.");
        }
    };
}
