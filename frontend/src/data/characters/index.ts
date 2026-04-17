import type { IItem } from "../items";

export type ScalarType = "number" | "string" | "boolean";
export type CollectionType = "collection";


export interface IBaseField {
  key: string;
  label: string;
  type: any;
}

interface ScalarField extends IBaseField {
  type: ScalarType;
  value: number | string | boolean;
}

interface CollectionField extends IBaseField {
  type: CollectionType;
  value: IItem[];
}

export type FieldType = ScalarField | CollectionField;

export interface ICharacter {
  id: string;
  fields: FieldType[];
}
