import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const expenseCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  { name: 'Groceries', icon: '🛒', color: '#4ECDC4' },
  { name: 'Transportation', icon: '🚗', color: '#45B7D1' },
  { name: 'Utilities', icon: '💡', color: '#FFA07A' },
  { name: 'Entertainment', icon: '🎬', color: '#FFD93D' },
  { name: 'Shopping', icon: '🛍️', color: '#FF69B4' },
  { name: 'Healthcare', icon: '🏥', color: '#87CEEB' },
  { name: 'Education', icon: '📚', color: '#DDA15E' },
  { name: 'Travel', icon: '✈️', color: '#BC6C25' },
  { name: 'Insurance', icon: '🛡️', color: '#6A4C93' },
  { name: 'Rent/Mortgage', icon: '🏠', color: '#C7CEEA' },
  { name: 'Phone & Internet', icon: '📱', color: '#B5B8DB' },
  { name: 'Fitness', icon: '💪', color: '#90BE6D' },
  { name: 'Subscriptions', icon: '🔄', color: '#F94144' },
  { name: 'Gifts', icon: '🎁', color: '#F9C74F' },
  { name: 'Personal Care', icon: '💇', color: '#D4A5A5' },
  { name: 'Pet Care', icon: '🐕', color: '#FAAE7D' },
  { name: 'Other', icon: '📌', color: '#9B9B9B' },
];

const incomeCategories = [
  { name: 'Salary', icon: '💼', color: '#06D6A0' },
  { name: 'Freelance', icon: '💻', color: '#118AB2' },
  { name: 'Bonus', icon: '🎉', color: '#073B4C' },
  { name: 'Investment Returns', icon: '📈', color: '#EF476F' },
  { name: 'Rental Income', icon: '🏘️', color: '#FFD166' },
  { name: 'Gifts Received', icon: '🎁', color: '#06FFA5' },
  { name: 'Other Income', icon: '💰', color: '#88D8B0' },
];

async function main() {
  console.log('Seeding categories...');

  // Clear existing categories
  await prisma.category.deleteMany({});

  // Seed expense categories
  for (const category of expenseCategories) {
    await prisma.category.create({
      data: {
        name: category.name,
        type: 'expense',
        icon: category.icon,
        color: category.color,
        isDefault: true,
      },
    });
  }

  // Seed income categories
  for (const category of incomeCategories) {
    await prisma.category.create({
      data: {
        name: category.name,
        type: 'income',
        icon: category.icon,
        color: category.color,
        isDefault: true,
      },
    });
  }

  console.log(`✓ Seeded ${expenseCategories.length} expense categories`);
  console.log(`✓ Seeded ${incomeCategories.length} income categories`);
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
