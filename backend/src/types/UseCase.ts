export interface IUseCase<DATA, RESPONSE> {
    execute(data: DATA): Promise<IUseCaseResponse<RESPONSE>>
}

export interface IUseCaseResponse<DATA> {
    data: DATA | null,
    message: string,
    error: false | boolean
}

export const withUseCaseResponse = <DATA>(data: DATA | null, message = '', error = false) => ({ data, message, error });