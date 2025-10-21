import type { FastifyInstance } from 'fastify';
import { openMaintenanceSchema, closeMaintenanceSchema } from '../schemas/maintenance.schema.js';
import { openTicket, closeTicket } from '../services/maintenance.service.js';

export default async function maintenanceRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [app.auth.requireUser(), app.auth.requireRoles('ADMIN', 'TECH')] }, async (req, reply) => {
    const dto = openMaintenanceSchema.parse(req.body);
    const created = await openTicket(app, { ...dto, openedBy: req.user?.idUser });
    return reply.code(201).send(created);
  });

  app.patch('/close', { preHandler: [app.auth.requireUser(), app.auth.requireRoles('ADMIN', 'TECH')] }, async (req) => {
    const dto = closeMaintenanceSchema.parse(req.body);
    return closeTicket(app, dto.idMaintenance);
  });
}
