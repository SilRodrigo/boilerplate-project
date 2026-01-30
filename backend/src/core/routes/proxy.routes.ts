import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware'

const proxyRoutes = Router();

proxyRoutes.use(
    '/',
    createProxyMiddleware({
        target: 'http://localhost:5173',
        changeOrigin: true,
        /* ws: true */
    })
);

export { proxyRoutes }