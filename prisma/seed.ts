import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const pw = 'ChangeMe123!';
  const hash = await bcrypt.hash(pw, 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: Role.ADMIN,
      passwordHash: hash
    }
  });

  await prisma.newsPost.createMany({
    data: [
      {
        title: 'Willkommen zum Vereinsportal',
        slug: 'willkommen',
        content: 'Erste Nachricht auf der Vereinswebsite.',
        publishedAt: new Date()
      }
    ]
  });

  await prisma.event.createMany({
    data: [
      {
        title: 'Jahreshauptversammlung',
        location: 'Gemeindehaus',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 2),
        description: 'Jahresrückblick und Wahlen.'
      }
    ]
  });

  console.log('Seed finished. Admin: admin@example.com / ChangeMe123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
