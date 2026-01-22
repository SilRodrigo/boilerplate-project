import { IRequestExampleDto } from "../dtos";

export interface IExample {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export const exampleFactory = (requestExampleDto: IRequestExampleDto): IExample => {
    const example: IExample = {
        id: requestExampleDto.id,
        name: requestExampleDto.name,
        description: requestExampleDto.description,
        createdAt: requestExampleDto.createdAt,
        updatedAt: requestExampleDto.updatedAt,
    };

    return example;
};
