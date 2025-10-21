import { z } from 'zod';

export const createAssetSchema = z.object({
  idLab: z.number().int().optional(),
  idLocal: z.number().int().optional(),
  model: z.string().optional(),
  patrimony: z.number().int(),
  category: z.string().optional(),
  serial: z.string().optional()
});

export const moveAssetSchema = z.object({
  toIdLab: z.number().int().nullable().optional(),
  toIdLocal: z.number().int().nullable().optional(),
  note: z.string().optional()
});

export const statusChangeSchema = z.object({
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'LOANED']),
  note: z.string().optional()
});
