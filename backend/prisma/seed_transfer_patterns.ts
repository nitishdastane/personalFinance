import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transferPatterns = [
  {
    pattern: 'NITISH ICICI',
    targetBankName: 'ICICI',
    description: 'Transfer to ICICI bank',
  },
  {
    pattern: 'NITISHSBI',
    targetBankName: 'SBI',
    description: 'Transfer to SBI bank',
  },
  {
    pattern: 'Nitish Dileep Dastane/STATE BANK OF INDIA/Family',
    targetBankName: 'SBI',
    description: 'Transfer to SBI bank - Family account',
  },
];

async function main() {
  console.log('Seeding transfer patterns...');

  // Clear existing patterns
  await prisma.transferPattern.deleteMany({});

  // Seed patterns
  for (const pattern of transferPatterns) {
    await prisma.transferPattern.create({
      data: {
        pattern: pattern.pattern,
        targetBankName: pattern.targetBankName,
        description: pattern.description,
        isActive: true,
      },
    });
  }

  console.log(`✓ Seeded ${transferPatterns.length} transfer patterns`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
