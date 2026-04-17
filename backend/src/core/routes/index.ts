import { Router } from 'express'

import { PREFIX_ROUTE } from '../url';

import { exampleRoutes } from './example.routes';
import { fundRoutes } from './fund.routes';
import { marketRoutes } from './market.routes';

import { responseValidator } from '../../middlewares/responseValidatorMiddleware';

const routes = Router();

routes.use(responseValidator);

routes.use(`${PREFIX_ROUTE}/example`, exampleRoutes);
routes.use(`${PREFIX_ROUTE}/funds`, fundRoutes);
routes.use(`${PREFIX_ROUTE}/market`, marketRoutes);

export { routes }
