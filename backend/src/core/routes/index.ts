import fs from 'fs';
import path from 'path';
import { Router } from 'express'

import { PREFIX_ROUTE } from '../url';

import { responseValidator } from '../../middlewares/responseValidatorMiddleware';

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
