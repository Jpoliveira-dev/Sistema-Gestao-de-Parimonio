// src/plugins/auth.ts
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

// use o enum do Prisma se preferir, mas a união literal evita dependência aqui
type Role = 'ADMIN' | 'TECH' | 'CONSULTA';

// Diga ao @fastify/jwt qual é o shape do payload e do req.user
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { idUser: number; role: Role; email: string }; // o que vai no token
    user: { idUser: number; role: Role; email: string };    // o que aparece em req.user
  }
}

// Se quiser expor os helpers no app.auth
declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      requireUser: () => (req: any) => Promise<void>;
      requireRoles: (...roles: Role[]) => (req: any) => Promise<void>;
    };
  }
}

export const authPlugin = fp(async (app) => {
  app.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret'
  });

  app.decorate('auth', {
    requireUser: () => async (req: any) => {
      try {
        await req.jwtVerify(); // popula req.user tipado via FastifyJWT
      } catch {
        // funciona com @fastify/sensible; se faltar, faz fallback para Error
        const err =
          (app as any).httpErrors?.unauthorized?.('Token inválido ou ausente') ??
          new Error('Unauthorized');
        throw err;
      }
    },

    requireRoles: (...roles: Role[]) => async (req: any) => {
      // garante que req.user existe e está tipado
      await req.jwtVerify();
      const role = req.user?.role as Role | undefined;
      if (!role || !roles.includes(role)) {
        const err =
          (app as any).httpErrors?.forbidden?.('Sem permissão') ??
          new Error('Forbidden');
        throw err;
      }
    }
  });

  // ❌ NÃO use app.decorateRequest('user', null)
});
