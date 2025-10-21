import { z } from 'zod';

export const openMaintenanceSchema = z.object({
  idAssets: z.number().int(),
  description: z.string().min(3),
  openedBy: z.number().int().optional()
});

export const closeMaintenanceSchema = z.object({
  idMaintenance: z.number().int()
});
