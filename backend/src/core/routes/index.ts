import { Router } from 'express'
import { PREFIX_ROUTE } from '../url';
import { exampleRoutes } from './example.routes';
import { responseValidator } from '../../middlewares/responseValidatorMiddleware';
import { createProxyMiddleware } from 'http-proxy-middleware'
import { proxyRoutes } from './proxy.routes';

const routes = Router();

routes.use(responseValidator);

routes.use(`${PREFIX_ROUTE}/example`, exampleRoutes);
routes.use(proxyRoutes);

export { routes }