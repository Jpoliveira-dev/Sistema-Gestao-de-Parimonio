import type { FastifyInstance } from 'fastify';
import { comparePassword } from '../utils/passwords.js';

export async function login(app: FastifyInstance, email: string, senha: string) {
  const user = await app.prisma.user.findUnique({ where: { email } });
  if (!user) throw app.httpErrors.unauthorized('Credenciais inválidas');

  const ok = await comparePassword(senha, user.senha);
  if (!ok) throw app.httpErrors.unauthorized('Credenciais inválidas');

  const token = app.jwt.sign({ idUser: user.idUser, role: user.role, email: user.email }, { expiresIn: '7d' });
  return { token, user: { idUser: user.idUser, role: user.role, email: user.email, nome: user.nome } };
}
