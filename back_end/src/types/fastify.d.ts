import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { idUser: number; role: 'ADMIN' | 'TECH' | 'CONSULTA'; email: string };
  }
}
