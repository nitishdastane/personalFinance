# Database Setup Guide

## Quick Start

### Option 1: Using Prisma (Recommended)
```bash
cd backend
npx prisma migrate deploy
npm run db:seed
```

### Option 2: Using PostgreSQL CLI
```bash
# Create database
createdb -U postgres personal_finance

# Run migrations
psql -U postgres -d personal_finance < ../sql/migrations/001_init_schema.sql
psql -U postgres -d personal_finance < ../sql/migrations/002_add_categories.sql

# Seed categories
psql -U postgres -d personal_finance < ../sql/seed_categories.sql
```

## File Structure

```
sql/
├── README.md                 # Database schema documentation
├── SETUP.md                  # This file
├── seed_categories.sql       # Default category data
└── migrations/
    ├── 001_init_schema.sql   # Initial schema setup
    └── 002_add_categories.sql # Categories table
```

## Database Requirements

- PostgreSQL 12+
- User: `postgres`
- Password: `postgres`
- Database: `personal_finance`

## Default Connection String

```
postgresql://postgres:postgres@localhost:5432/personal_finance
```

## What Gets Created

### Tables
- `BankAccount` - Bank account records
- `CreditCard` - Credit card records
- `BankTransaction` - Bank transactions (debit/credit)
- `CreditCardTransaction` - Credit card transactions
- `Category` - Transaction categories (expense/income/transfer)

### Indexes
- Unique constraints on names and fingerprints
- Performance indexes on frequently queried columns
- Foreign key relationships with cascading deletes

### Default Categories
- **Expense**: 18 categories (Food, Travel, Utilities, etc.)
- **Income**: 7 categories (Salary, Freelance, Bonus, etc.)
- **Transfer**: 2 categories (Account to Account, Credit Card Payment)

## Resetting the Database

```bash
# Using Prisma
cd backend
npx prisma migrate reset

# Using PostgreSQL
psql -U postgres -c "DROP DATABASE IF EXISTS personal_finance;"
createdb -U postgres personal_finance
# Then run setup commands above
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running: `brew services start postgresql` (macOS)
- Check connection string in `.env` file

### Migration Already Applied
- Run `npx prisma migrate deploy` again
- Prisma tracks migrations in `_prisma_migrations` table

### Categories Not Showing
- Run: `npm run db:seed` from backend directory
- Check database: `psql -U postgres -d personal_finance -c "SELECT * FROM \"Category\";"`
