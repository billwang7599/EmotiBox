import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      // userid will default to UUID
    },
  });

  const user2 = await prisma.user.create({
    data: {
      teamleadid: user1.userid,
      // userid auto-generated
    },
  });

  // Create messages for both users
  await prisma.message.createMany({
    data: [
      {
        userid: user1.userid,
        message: 'Hello from user1!',
        happiness: 0.9,
        sadness: 0.1,
        frustration: 0.2,
        tiredness: 0.1,
      },
      {
        userid: user2.userid,
        message: 'User2 checking in.',
        happiness: 0.6,
        sadness: 0.2,
        frustration: 0.4,
        tiredness: 0.3,
      },
      {
        userid: user1.userid,
        message: 'Another update from user1.',
        happiness: 0.7,
        sadness: 0.3,
        frustration: 0.1,
        tiredness: 0.5,
      },
    ],
  });

  console.log('Database seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });