import { IItem } from "./item";

type ScalarType = "number" | "string" | "boolean";
type CollectionType = "collection";

interface ScalarField {
    key: string;
    label: string;
    type: ScalarType;
    value: number | string | boolean;
}

interface CollectionField {
    key: string;
    label: string;
    type: CollectionType;
    value: IItem[];
}

type FieldType = ScalarField | CollectionField;

export interface ICharacter {
    id: string;
    name: string;
    image: string;
    quote: string;
    bio: string;
    fields: FieldType[];
}