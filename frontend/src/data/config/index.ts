import { eldritchConfig } from "./eldritch";
import { mansionsOfMadnessConfig } from "./mansions-of-madness";

export interface IConfig {
    background: string;
    colors: object;
}

export const config: { [key: string]: IConfig } = {
    eldritch: eldritchConfig,
    mansions_of_madness: mansionsOfMadnessConfig
};