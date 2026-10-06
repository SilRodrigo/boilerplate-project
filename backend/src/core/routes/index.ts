import { Router } from 'express'

import { PREFIX_ROUTE } from '../url';

import { exampleRoutes } from './example.routes';
import { userRoutes } from './user.routes';

import { responseValidator } from '../../middlewares/responseValidatorMiddleware';

const routes = Router();

routes.use(responseValidator);

routes.use(`${PREFIX_ROUTE}/example`, exampleRoutes);
routes.use(`${PREFIX_ROUTE}/user`, userRoutes);

export { routes }