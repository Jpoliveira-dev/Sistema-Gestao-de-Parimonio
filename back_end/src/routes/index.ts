import type { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes.js';
import assetsRoutes from './assets.routes.js';
import maintenanceRoutes from './maintenance.routes.js';

export default async function routes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(assetsRoutes, { prefix: '/assets' });
  app.register(maintenanceRoutes, { prefix: '/maintenance' });
}
