import { eldritchConfig } from "./eldritch";

export interface IConfig {
    background: string;
    colors: object;
}

export const config: { [key: string]: IConfig } = {
    eldritch: eldritchConfig,
};