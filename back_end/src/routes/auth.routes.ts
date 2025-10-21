import type { FastifyInstance } from 'fastify';
import { loginSchema } from '../schemas/auth.schema.js';
import { login } from '../services/auth.service.js';

export default async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (req, reply) => {
    const parsed = loginSchema.parse(req.body); // valida aqui com Zod
    const result = await login(app, parsed.email, parsed.senha);
    return reply.send(result);
  });
}
