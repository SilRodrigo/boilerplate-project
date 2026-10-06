import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IUser } from '../../../entities/user';
import { IUserAuthUseCase } from './useCase';

interface IFactoryParams {
    userAuthUseCase: IUserAuthUseCase;
}

export interface IUserAuthController extends IController<{ accessToken: string; user: IUser }> { }

export default function userAuthControllerFactory({
    userAuthUseCase
}: IFactoryParams): IUserAuthController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { email, password } = request.body ?? {};

            if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
                return errorResponse(response, new Error("Email and password are required."), 400);
            }

            try {
                const { data, message } = await userAuthUseCase.execute({ email, password });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
