import fs from 'fs';
import path from 'path';
import { Router } from 'express'

import { PREFIX_ROUTE } from '../url';

import { responseValidator } from '../../middlewares/responseValidatorMiddleware';

/*
 * Every `<name>.routes.ts` file in this folder is mounted automatically, so new
 * modules never need to touch this file.
 *
 * - The file default-exports an express Router.
 * - It is mounted at `${PREFIX_ROUTE}/<name>` (e.g. `example.routes.ts` -> `/api/v1/example`).
 * - To mount it somewhere else, also export `basePath` (e.g. `export const basePath = '/game/ranch'`).
 */
const ROUTE_FILE = /^(.+)\.routes\.(js|ts)$/;

interface IRouteModule {
    default?: Router;
    basePath?: string;
}

export const loadRouteModules = (dir: string = __dirname) =>
    fs.readdirSync(dir)
        .filter((file) => ROUTE_FILE.test(file) && !file.endsWith('.d.ts'))
        .sort()
        .map((file) => {
            const name = file.match(ROUTE_FILE)![1];
            const routeModule: IRouteModule = require(path.join(dir, file));

            if (!routeModule.default) {
                throw new Error(`${file} must default-export an express Router.`);
            }

            return { file, path: routeModule.basePath ?? `/${name}`, router: routeModule.default };
        });

const routes = Router();

routes.use(responseValidator);

for (const { path: basePath, router } of loadRouteModules()) {
    routes.use(`${PREFIX_ROUTE}${basePath}`, router);
}

export { routes }
