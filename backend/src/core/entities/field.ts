import { IItem } from "./item";

export type ScalarType = "number" | "string" | "boolean";
export type CollectionType = "collection";

export interface ScalarField {
    key: string;
    label: string;
    type: ScalarType;
    value: number | string | boolean;
}

export interface CollectionField {
    key: string;
    label: string;
    type: CollectionType;
    value: IItem[];
}

export type FieldType = ScalarField | CollectionField;