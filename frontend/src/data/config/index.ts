import type { GameId } from "../catalog";
import type { IItem } from "../items";
import { eldritchConfig } from "./eldritch";
import { mansionsOfMadnessConfig } from "./mansions-of-madness";

export interface IConfig {
    background: string;
    colors: object;
}

export const config: { [key in GameId]: IConfig } = {
    eldritch: eldritchConfig,
    mansions_of_madness: mansionsOfMadnessConfig
};

interface ScalarField extends IBaseField {
    type: ScalarType;
    value: number | string | boolean;
}

interface CollectionField extends IBaseField {
    type: CollectionType;
    value: IItem[];
}

export type ScalarType = "number" | "string" | "boolean";
export type CollectionType = "collection";

export interface IBaseField {
    key: string;
    label: string;
    type: any;
}

export type FieldType = ScalarField | CollectionField;
