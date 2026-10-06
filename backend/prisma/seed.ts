import { config } from 'dotenv'
import bcrypt from 'bcrypt'
import { PrismaClient, UserType } from '@prisma/client'

config();

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    throw new Error('SEED_ADMIN_PASSWORD is not set. Define it in the .env file.');
  }

  // Does not touch an existing user, so re-running the seed never resets a password
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: await bcrypt.hash(password, 10),
      userType: UserType.ADMIN,
    },
  });

  console.log(`Admin user ready: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
