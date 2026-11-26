import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IController } from '../../../../types/Controller';
import { IUser } from '../../../entities/user';
import { IUserRegisterUseCase } from './useCase';

interface IFactoryParams {
    userRegisterUseCase: IUserRegisterUseCase;
}

export interface IUserRegisterController extends IController<{ accessToken: string; user: IUser }> { }

export default function userRegisterControllerFactory({
    userRegisterUseCase
}: IFactoryParams): IUserRegisterController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { email, password } = request.body ?? {};

            if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
                return errorResponse(response, new Error("Email and password are required."), 400);
            }

            try {
                const { data, message } = await userRegisterUseCase.execute({ email, password });

                return successResponse(response, data, message, 201);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
