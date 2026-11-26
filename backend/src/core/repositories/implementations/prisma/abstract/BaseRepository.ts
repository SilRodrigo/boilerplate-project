import { Prisma, PrismaClient } from "@prisma/client";
import { resultPaginated } from "../../../../../helpers";
import { DuplicateError } from "../../../../../helpers/duplicateError";
import { IPaginationResult } from "../../../../../helpers/pagination";
import { prismaClient } from "../../../../../libs";
import { IListQuery } from "../../../../../types/ListQuery";
import { IBaseRepository } from "../../../contracts/IBaseRepository";
import { toPrismaOrderBy, toPrismaWhere } from "./listQueryToPrisma";

const rethrowDuplicate = (err: unknown): never => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const target = (err.meta as { target?: string[] | string } | undefined)?.target;
        throw new DuplicateError(Array.isArray(target) ? target : target ? [target] : []);
    }
    throw err;
};

export abstract class PrismaBaseRepository<T extends keyof typeof prismaClient, I, E, C, R, U, F extends string = string>
    implements IBaseRepository<E, C, U, F> {

    private index: keyof typeof prismaClient;
    private include: I;

    protected repository?: any
    protected modelFactory: (data: R) => E;

    constructor(index: T, modelFactory: (data: R) => E, include: I) {
        this.index = index;
        this.repository = prismaClient[index];
        this.modelFactory = modelFactory;
        this.include = include;
    }

    protected instance(data: R): E {
        return this.modelFactory(data);
    }

    async create(data: C, $transaction?: PrismaClient): Promise<E> {
        const repository = $transaction?.[this.index] || this.repository;
        const entity = await repository.create({
            data
        }).catch(rethrowDuplicate);

        return this.instance(entity);
    }

    async update(id: string, data: U, $transaction?: PrismaClient): Promise<E> {
        const repository = $transaction?.[this.index] || this.repository;
        const entity = await repository.update({
            data,
            where: { id }
        }).catch(rethrowDuplicate);

        return this.instance(entity);
    }

    async delete(id: string, $transaction?: PrismaClient): Promise<void> {
        const repository = $transaction?.[this.index] || this.repository;
        await repository.delete({
            where: { id }
        });
    }

    async findByUnique(where: object, include?: I | false, $transaction?: PrismaClient): Promise<E | null> {
        const repository = $transaction?.[this.index] || this.repository;

        const queryOptions: any = { where };
        if (include !== false) {
            queryOptions.include = {
                ...this.include,
                ...include
            };
        }

        const entity = await repository.findUnique(queryOptions);

        return entity ? this.instance(entity) : null;
    }

    async findById(id: string, include?: I | false, $transaction?: PrismaClient): Promise<E | null> {
        if (!id) return null;

        return this.findByUnique({ id }, include, $transaction);
    }

    async findByFilter(
        { currentPage, pageSize, filter, order, include }: IListQuery<F> & { include?: I | false },
        $transaction?: PrismaClient
    ): Promise<IPaginationResult<E>> {
        const repository = $transaction?.[this.index] || this.repository;
        const where = toPrismaWhere(filter);

        const queryOptions: any = {
            where,
            orderBy: toPrismaOrderBy(order),
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
        };
        if (include !== false) {
            queryOptions.include = {
                ...this.include,
                ...include
            }
        }

        const [rows, totalCount] = await Promise.all([
            repository.findMany(queryOptions),
            repository.count({ where }),
        ]);

        const items = rows.map((item: any) => this.instance(item));

        return resultPaginated({ items, currentPage, pageSize, totalCount });
    }
}
