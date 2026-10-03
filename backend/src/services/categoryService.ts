import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllCategories(type?: 'income' | 'expense') {
  const categories = await prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
  });
  return categories;
}

export async function createCategory(
  name: string,
  type: 'income' | 'expense',
  icon?: string,
  color?: string
) {
  const category = await prisma.category.create({
    data: {
      name,
      type,
      icon,
      color,
      isDefault: false,
    },
  });
  return category;
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    icon?: string;
    color?: string;
  }
) {
  const category = await prisma.category.update({
    where: { id },
    data,
  });
  return category;
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.delete({
    where: { id },
  });
  return category;
}
