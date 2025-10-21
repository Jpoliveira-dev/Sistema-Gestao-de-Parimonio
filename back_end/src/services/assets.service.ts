import type { FastifyInstance } from 'fastify';
import { EventType, AssetsStatus } from '@prisma/client';
import { NotFoundError } from '../common/errors.js';

export async function createAsset(app: FastifyInstance, data: {
  idLab?: number | null;
  idLocal?: number | null;
  model?: string | null;
  patrimony: number;
  category?: string | null;
  serial?: string | null;
  idUser?: number; // quem criou (para event)
}) {
  const asset = await app.prisma.assets.create({
    data: {
      idLab: data.idLab ?? null,
      idLocal: data.idLocal ?? null,
      model: data.model ?? null,
      patrimony: data.patrimony,
      category: data.category ?? null,
      serial: data.serial ?? null
    }
  });

  await app.prisma.assetsEvent.create({
    data: {
      idAssets: asset.idAssets,
      idUser: data.idUser ?? null,
      type: EventType.CHECKIN,
      toIdLab: data.idLab ?? null,
      toIdLocal: data.idLocal ?? null,
      note: 'Asset criado'
    }
  });

  return asset;
}

export async function moveAsset(app: FastifyInstance, assetId: number, options: {
  from: { lab?: number | null; local?: number | null };
  to: { lab?: number | null; local?: number | null };
  note?: string;
  idUser?: number | null;
}) {
  const exists = await app.prisma.assets.findUnique({ where: { idAssets: assetId } });
  if (!exists) throw new NotFoundError('Asset não encontrado');

  const updated = await app.prisma.$transaction(async (tx) => {
    const upd = await tx.assets.update({
      where: { idAssets: assetId },
      data: { idLab: options.to.lab ?? null, idLocal: options.to.local ?? null }
    });

    await tx.assetsEvent.create({
      data: {
        idAssets: assetId,
        idUser: options.idUser ?? null,
        type: EventType.MOVE,
        fromIdLab: options.from.lab ?? null,
        fromIdLocal: options.from.local ?? null,
        toIdLab: options.to.lab ?? null,
        toIdLocal: options.to.local ?? null,
        note: options.note ?? null
      }
    });
    return upd;
  });

  return updated;
}

export async function changeAssetStatus(app: FastifyInstance, assetId: number, status: AssetsStatus, note?: string, idUser?: number | null) {
  const asset = await app.prisma.assets.findUnique({ where: { idAssets: assetId } });
  if (!asset) throw new NotFoundError('Asset não encontrado');

  const updated = await app.prisma.assets.update({
    where: { idAssets: assetId },
    data: { status }
  });

  await app.prisma.assetsEvent.create({
    data: {
      idAssets: assetId,
      idUser: idUser ?? null,
      type: EventType.STATUS_CHANGE,
      fromIdLab: asset.idLab,
      fromIdLocal: asset.idLocal,
      toIdLab: asset.idLab,
      toIdLocal: asset.idLocal,
      note: note ?? `Status -> ${status}`
    }
  });

  return updated;
}
