import { IExample, exampleFactory } from "../../../entities/example";
import { ICreateExampleDto, IRequestExampleDto, IUpdateExampleDto } from "../../../dtos";
import { PrismaBaseRepository } from "./abstract/BaseRepository";
import { ExampleFilterField, IIncludeExampleDto } from "../../../dtos/example";
import { IExampleRepository } from "../../contracts/IExampleRepository";

const INDEX_KEY = 'example' as const;

export default class PrismaExampleRepository extends PrismaBaseRepository<
    typeof INDEX_KEY,
    IIncludeExampleDto,
    IExample,
    ICreateExampleDto,
    IRequestExampleDto,
    IUpdateExampleDto,
    ExampleFilterField> implements IExampleRepository {

    constructor() {
        const include = {}

        super(INDEX_KEY, exampleFactory, include)
    }
}
