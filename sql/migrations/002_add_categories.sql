-- Add Categories Table
-- Supports expense, income, and transfer categories
-- Includes pre-defined default categories with custom category support

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex - Unique constraint on category name
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex - Index for filtering by category type
CREATE INDEX "Category_type_idx" ON "Category"("type");
