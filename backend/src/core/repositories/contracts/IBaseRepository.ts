import { IPaginationResult } from "../../../helpers/pagination";
import { IListQuery } from "../../../types/ListQuery";

export interface IBaseRepository<E, C, U, F extends string = string> {
    create(data: C): Promise<E>;
    update(id: string, data: U): Promise<E>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<E | null>;
    findByFilter(query: IListQuery<F>): Promise<IPaginationResult<E>>;
}
