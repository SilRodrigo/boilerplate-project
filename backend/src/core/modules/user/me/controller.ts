import { Response } from 'express';
import { successResponse } from '../../../../helpers/response';
import { IAuthController } from '../../../../types/Controller';
import { IUser } from '../../../entities/user';

export interface IUserMeController extends IAuthController<IUser> { }

// The user is already loaded by authMiddleware
export default function userMeControllerFactory(): IUserMeController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            return successResponse(response, request.user, "User retrieved successfully.");
        }
    };
}
