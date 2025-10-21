import type { FastifyInstance } from 'fastify';
import { createAssetSchema, moveAssetSchema, statusChangeSchema } from '../schemas/assets.schema.js';
import { createAsset, moveAsset, changeAssetStatus } from '../services/assets.service.js';
import { AssetsStatus } from '@prisma/client';

export default async function assetsRoutes(app: FastifyInstance) {
  // criar asset
  app.post('/', { preHandler: [app.auth.requireUser(), app.auth.requireRoles('ADMIN', 'TECH')] }, async (req, reply) => {
    const dto = createAssetSchema.parse(req.body);
    const me = req.user!;
    const created = await createAsset(app, { ...dto, idUser: me.idUser });
    return reply.code(201).send(created);
  });

  // listar (simples)
  app.get('/', { preHandler: [app.auth.requireUser()] }, async (_req, _reply) => {
    return app.prisma.assets.findMany({ orderBy: { idAssets: 'desc' }, take: 100 });
  });

  // mover asset
  app.patch('/:id/move', { preHandler: [app.auth.requireUser(), app.auth.requireRoles('ADMIN', 'TECH')] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const dto = moveAssetSchema.parse(req.body);
    const current = await app.prisma.assets.findUnique({ where: { idAssets: Number(id) } });
    const updated = await moveAsset(app, Number(id), {
      from: { lab: current?.idLab ?? null, local: current?.idLocal ?? null },
      to: { lab: dto.toIdLab ?? null, local: dto.toIdLocal ?? null },
      note: dto.note,
      idUser: req.user!.idUser
    });
    return reply.send(updated);
  });

  // mudar status
  app.patch('/:id/status', { preHandler: [app.auth.requireUser(), app.auth.requireRoles('ADMIN', 'TECH')] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const dto = statusChangeSchema.parse(req.body);
    const updated = await changeAssetStatus(app, Number(id), dto.status as AssetsStatus, dto.note, req.user!.idUser);
    return reply.send(updated);
  });

  // eventos do asset
  app.get('/:id/events', { preHandler: [app.auth.requireUser()] }, async (req) => {
    const { id } = req.params as { id: string };
    return app.prisma.assetsEvent.findMany({
      where: { idAssets: Number(id) },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  });
}
