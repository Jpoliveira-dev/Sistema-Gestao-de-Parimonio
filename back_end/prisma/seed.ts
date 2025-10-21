import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/passwords.js';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!exists) {
    await prisma.user.create({
      data: {
        nome: 'Admin',
        email: adminEmail,
        senha: await hashPassword('admin123'),
        role: Role.ADMIN
      }
    });
    console.log('✅ Usuário admin criado:', adminEmail, 'senha: admin123');
  } else {
    console.log('ℹ️ Admin já existe.');
  }

  // exemplo de Location e Lab
  const loc = await prisma.location.upsert({
    where: { idLocal: 1 },
    update: {},
    create: { name: 'Sede' }
  });
  await prisma.lab.create({ data: { nameLab: 'Lab 01', idLocal: loc.idLocal } });
}

main().finally(async () => prisma.$disconnect());
