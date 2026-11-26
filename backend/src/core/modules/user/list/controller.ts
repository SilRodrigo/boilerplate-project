import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IAuthController } from '../../../../types/Controller';
import { IUserListUseCase } from './useCase';
import { parseListParams } from '../../../../helpers/parseListParams';
import { USER_FILTER_FIELDS, USER_ORDER_FIELDS } from '../../../dtos/user';

interface IFactoryParams {
    userListUseCase: IUserListUseCase;
}

export interface IUserListController extends IAuthController<any> { }

export default function userListControllerFactory({
    userListUseCase
}: IFactoryParams): IUserListController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            try {
                const { currentPage, pageSize, filter, order } = parseListParams(request.query, {
                    filterFields: USER_FILTER_FIELDS,
                    orderFields: USER_ORDER_FIELDS,
                });

                const { data, message } = await userListUseCase.execute({ currentPage, pageSize, filter, order });

                return successResponse(response, data, message);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
