import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  // Create a lab
  const lab = await prisma.lab.create({
    data: {
      name: 'RobotComLab Principal',
      address: '123 Main St, Anytown USA',
      phone: '555-1234',
      email: 'contact@robotcomlab.com',
    },
  });
  console.log(`Created lab: ${lab.name}`);

  // Create a user
  const passwordHash = await bcrypt.hash('password', SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: passwordHash,
      fullName: 'Admin User',
      email: 'admin@robotcomlab.com',
      role: 'admin',
      labId: lab.id,
    },
  });
  console.log(`Created user: ${user.username}`);

  // Create some tests
  await prisma.test.createMany({
    data: [
      { code: 'GLU', name: 'Glucosa', price: 5.00, category: 'Química' },
      { code: 'CHO', name: 'Colesterol Total', price: 7.50, category: 'Química' },
      { code: 'TRI', name: 'Triglicéridos', price: 7.50, category: 'Química' },
      { code: 'URI', name: 'Ácido Úrico', price: 6.00, category: 'Química' },
      { code: 'CBC', name: 'Hemograma Completo', price: 15.00, category: 'Hematología' },
    ],
  });
  console.log('Created tests');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
