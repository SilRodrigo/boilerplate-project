import { IExample } from "../../entities/example";
import { ExampleFilterField, ICreateExampleDto, IUpdateExampleDto } from "../../dtos/example";
import { IBaseRepository } from "./IBaseRepository";

export interface IExampleRepository extends IBaseRepository<IExample, ICreateExampleDto, IUpdateExampleDto, ExampleFilterField> { }
