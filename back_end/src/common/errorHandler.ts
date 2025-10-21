import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DomainError } from './errors.js';

export function errorHandler(
  error: FastifyError | DomainError,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  const status = (error as DomainError).statusCode ?? error.statusCode ?? 500;
  const message = error.message || 'Erro interno';
  reply.status(status).send({ error: { message } });
}
