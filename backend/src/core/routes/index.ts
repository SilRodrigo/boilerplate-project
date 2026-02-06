import { Router } from 'express'
import { PREFIX_ROUTE } from '../url';
import { exampleRoutes } from './example.routes';
import { responseValidator } from '../../middlewares/responseValidatorMiddleware';
import { proxyRoutes } from './proxy.routes';
import { characterRoutes } from './character.routes';
import { playerRoutes } from './player.routes';
import { adminRoutes } from './admin.routes';
import { itemRoutes } from './item.routes';
import { spectatorRoutes } from './spectator.routes';

const routes = Router();

routes.use(responseValidator);

routes.use(`${PREFIX_ROUTE}/example`, exampleRoutes);
routes.use(`${PREFIX_ROUTE}/character`, characterRoutes);
routes.use(`${PREFIX_ROUTE}/item`, itemRoutes);
routes.use(`${PREFIX_ROUTE}/player`, playerRoutes);
routes.use(`${PREFIX_ROUTE}/admin`, adminRoutes);
routes.use(`${PREFIX_ROUTE}/spectator`, spectatorRoutes);
    
routes.use(proxyRoutes);

export { routes }