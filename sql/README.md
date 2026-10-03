# Database Schema

This folder contains all SQL migration files for the Personal Finance Dashboard database.

## Migrations

### 001_init_schema.sql
- **Description**: Initial database schema
- **Tables Created**:
  - `BankAccount` - Stores bank account information
  - `CreditCard` - Stores credit card information
  - `BankTransaction` - Stores bank account transactions with debit/credit amounts
  - `CreditCardTransaction` - Stores credit card transactions

### 002_add_categories.sql
- **Description**: Adds category support for organizing transactions
- **Tables Created**:
  - `Category` - Stores expense, income, and transfer categories
- **Features**:
  - Support for expense, income, and transfer category types
  - Pre-defined default categories
  - Custom user-defined categories
  - Icon and color customization

## Database Schema Overview

```
BankAccount
├── id (PRIMARY KEY)
├── name (UNIQUE)
├── createdAt
└── updatedAt

CreditCard
├── id (PRIMARY KEY)
├── name (UNIQUE)
├── createdAt
└── updatedAt

BankTransaction
├── id (PRIMARY KEY)
├── bankAccountId (FOREIGN KEY)
├── transactionDate
├── transactionDetails
├── debitAmount
├── creditAmount
├── balance
├── fingerprint (for duplicate detection)
└── createdAt

CreditCardTransaction
├── id (PRIMARY KEY)
├── creditCardId (FOREIGN KEY)
├── transactionDate
├── transactionDetails
├── amount
├── type (Debit/Credit)
├── fingerprint (for duplicate detection)
└── createdAt

Category
├── id (PRIMARY KEY)
├── name (UNIQUE)
├── type (expense/income/transfer)
├── icon (emoji or icon name)
├── color (hex color code)
├── isDefault (true for pre-defined, false for custom)
├── createdAt
└── updatedAt
```

## Running Migrations

### Using Prisma (Recommended)
```bash
cd backend
npx prisma migrate deploy
```

### Using PostgreSQL CLI
```bash
psql -U postgres -d personal_finance -f sql/migrations/001_init_schema.sql
psql -U postgres -d personal_finance -f sql/migrations/002_add_categories.sql
```

## Database Connection

The application uses PostgreSQL with the following default connection:
- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: postgres
- **Database**: personal_finance

## Seeding Data

To populate the database with default categories:

```bash
cd backend
npm run db:seed
```

This will create:
- 18 expense categories
- 7 income categories
- 2 transfer categories
