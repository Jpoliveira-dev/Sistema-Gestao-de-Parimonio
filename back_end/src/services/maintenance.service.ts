import type { FastifyInstance } from 'fastify';
import { MaintenanceStatus } from '@prisma/client';
import { NotFoundError } from '../common/errors.js';

export async function openTicket(app: FastifyInstance, data: { idAssets: number; description: string; openedBy?: number | null }) {
  // opcional: validar se asset existe
  return app.prisma.maintenance.create({
    data: {
      idAssets: data.idAssets,
      description: data.description,
      openedBy: data.openedBy ?? null,
      status: MaintenanceStatus.OPEN
    }
  });
}

export async function closeTicket(app: FastifyInstance, idMaintenance: number) {
  const ticket = await app.prisma.maintenance.findUnique({ where: { idMaintenance } });
  if (!ticket) throw new NotFoundError('Chamado não encontrado');
  return app.prisma.maintenance.update({
    where: { idMaintenance },
    data: { status: MaintenanceStatus.CLOSED, closedAt: new Date() }
  });
}
