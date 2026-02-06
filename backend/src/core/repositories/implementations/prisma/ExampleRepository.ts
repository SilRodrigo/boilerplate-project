import { IExample, exampleFactory } from "../../../entities/example";
import { ICreateExampleDto, IRequestExampleDto, IUpdateExampleDto } from "../../../dtos";
import { PrismaBaseRepository } from "./abstract/BaseRepository";
import { IIncludeExampleDto } from "../../../dtos/example";

const INDEX_KEY = 'example' as const;

export default class PrismaExampleRepository extends PrismaBaseRepository<
    typeof INDEX_KEY,
    IIncludeExampleDto,
    IExample,
    ICreateExampleDto,
    IRequestExampleDto,
    IUpdateExampleDto> {

    constructor() {
        const include = {}

        super(INDEX_KEY, exampleFactory, include)
    }
}
