# Personal Finance Dashboard

A complete personal finance management application that allows users to import and track bank accounts and credit card transactions from CSV files. Built with React, TypeScript, Node.js, Express, PostgreSQL, and Prisma.

## Features

✅ Import bank account transactions from CSV files  
✅ Import credit card transactions from CSV files  
✅ Automatic bank/credit card account creation  
✅ Duplicate transaction detection and prevention  
✅ Transaction filtering by date, type, amount, and search text  
✅ Server-side pagination for scalability  
✅ Comprehensive dashboard with summary statistics  
✅ Account management with transaction overview  
✅ Help modals with CSV format templates  
✅ Responsive design with Tailwind CSS  
✅ 100% local execution with Docker Compose

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide Icons** for icons
- **TanStack React Query** for data fetching

### Backend
- **Node.js** with TypeScript
- **Express.js** for REST API
- **Prisma ORM** for database access
- **PostgreSQL** for data persistence

### Infrastructure
- **Docker** and **Docker Compose** for containerization
- **PostgreSQL 16** Alpine for the database

## Prerequisites

- Docker and Docker Compose installed on your system
- Or: Node.js 18+, npm/yarn, and PostgreSQL 16+ for local development

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone or navigate to the project directory
cd personal-finance-dashboard

# Copy environment variables
cp .env.example .env

# Start all services (PostgreSQL, Backend, Frontend)
docker compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### First Run

When the containers start for the first time:
1. Database migrations run automatically
2. PostgreSQL initializes with the schema
3. Backend API starts on port 3001
4. Frontend dev server starts on port 3000

### Sample Data

Use the provided CSV files to test the application:

```bash
# In the browser, navigate to http://localhost:3000/import-statements
# Upload these files:
- sample-data/bank-statement.csv
- sample-data/credit-card-statement.csv
```

## Local Development (Without Docker)

If you prefer to run services locally:

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set Up PostgreSQL

```bash
# Install PostgreSQL 16 locally
# Create database
createdb personal_finance

# Set environment variables in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/personal_finance"
```

### 3. Run Database Migrations

```bash
cd backend
npm run db:migrate
```

### 4. Start Backend

```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

### 5. Start Frontend

```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env` and update values as needed:

```env
# Database
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=personal_finance

# Node Environment
NODE_ENV=development

# API Configuration
API_PORT=3001
API_URL=http://localhost:3001

# Frontend
VITE_API_URL=http://localhost:3001
```

## Database Configuration

### Prisma Schema

The application uses Prisma ORM with the following main entities:

- **BankAccount**: Represents a bank account
- **CreditCard**: Represents a credit card
- **BankTransaction**: Individual bank transactions
- **CreditCardTransaction**: Individual credit card transactions

### Database Migrations

Migrations are managed by Prisma and run automatically on service startup.

To manually run migrations:

```bash
# In backend directory
npm run db:migrate
```

To reset database (caution: destroys all data):

```bash
npm run db:reset
```

## CSV Formats

### Bank Statement CSV

Required columns: `Bank Name`, `Transaction Date`, `Transaction Details`, `Debit Amount`, `Credit Amount`, `Balance`

**Example:**

```csv
Bank Name,Transaction Date,Transaction Details,Debit Amount,Credit Amount,Balance
HDFC Bank,2026-01-01,Opening Balance,,50000.00,50000.00
HDFC Bank,2026-01-02,ATM Withdrawal,5000.00,,45000.00
HDFC Bank,2026-01-05,Salary,,75000.00,120000.00
```

**Rules:**
- `Bank Name`: Identifies the account (creates account if it doesn't exist)
- `Transaction Date`: Format YYYY-MM-DD or MM/DD/YYYY
- `Transaction Details`: Description of the transaction
- `Debit Amount`: Withdrawal amount (can be empty)
- `Credit Amount`: Deposit amount (can be empty)
- `Balance`: Account balance after the transaction
- Amounts can contain commas and currency symbols (normalized during import)

### Credit Card Statement CSV

Required columns: `Credit Card Name`, `Transaction Date`, `Transaction Details`, `Amount`, `Type`

**Example:**

```csv
Credit Card Name,Transaction Date,Transaction Details,Amount,Type
HDFC Credit Card,2026-01-02,Amazon Purchase,5500.00,Debit
HDFC Credit Card,2026-01-05,Cashback Reward,500.00,Credit
```

**Rules:**
- `Credit Card Name`: Identifies the card (creates card if it doesn't exist)
- `Transaction Date`: Format YYYY-MM-DD or MM/DD/YYYY
- `Transaction Details`: Description of the transaction
- `Amount`: Transaction amount
- `Type`: Must be `Debit` or `Credit`

## Import Behavior

### Duplicate Handling

The application uses a **composite fingerprint strategy** to detect duplicates:

#### Bank Transaction Fingerprint
```
bankAccountId + transactionDate + transactionDetails + debitAmount + creditAmount + balance
```

#### Credit Card Transaction Fingerprint
```
creditCardId + transactionDate + transactionDetails + amount + type
```

A transaction is considered a duplicate if:
1. The account already exists
2. All fingerprint fields match an existing transaction

**Benefits:**
- Multiple transactions on the same day are not treated as duplicates
- Handles concurrent imports safely
- Import is idempotent: uploading the same CSV twice won't create duplicates
- Database-level uniqueness constraints prevent race conditions

### Import Process

1. **Validate CSV structure** - Check headers and file format
2. **Parse rows** - Extract and validate each row
3. **Identify account** - Find or create bank/credit card account
4. **Calculate fingerprint** - Generate unique transaction identifier
5. **Check for duplicates** - Query database for existing transaction
6. **Insert transactions** - Add only new transactions in a transaction
7. **Generate summary** - Report results to user

### Import Summary

After a successful import, users see:

```
✓ Import completed

Account: HDFC Bank
Rows processed: 20
New transactions: 18
Duplicates skipped: 2
Invalid rows: 0

Transaction period:
01 Jan 2026 → 31 Mar 2026
```

## API Documentation

### Import Endpoints

#### POST /api/import/bank

Upload and import bank statement CSV.

**Request:**
```bash
curl -X POST http://localhost:3001/api/import/bank \
  -F "file=@bank-statement.csv"
```

**Response:**
```json
{
  "success": true,
  "accountId": "uuid",
  "accountName": "HDFC Bank",
  "rowsProcessed": 20,
  "newTransactions": 18,
  "duplicatesSkipped": 2,
  "invalidRows": [],
  "transactionPeriod": {
    "startDate": "2026-01-01",
    "endDate": "2026-03-31"
  }
}
```

#### POST /api/import/credit-card

Upload and import credit card statement CSV.

**Request:**
```bash
curl -X POST http://localhost:3001/api/import/credit-card \
  -F "file=@credit-card-statement.csv"
```

### Account Endpoints

#### GET /api/accounts/banks

List all bank accounts with summary information.

**Query Parameters:**
- `limit`: Number of accounts (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "HDFC Bank",
      "transactionCount": 15,
      "startDate": "2026-01-01",
      "endDate": "2026-03-15",
      "latestBalance": 177001.00,
      "lastImportedAt": "2026-10-02T12:00:00Z"
    }
  ],
  "total": 2,
  "limit": 50,
  "offset": 0
}
```

#### GET /api/accounts/banks/:id

Get details for a specific bank account.

#### GET /api/accounts/credit-cards

List all credit cards with summary information.

#### GET /api/accounts/credit-cards/:id

Get details for a specific credit card.

### Transaction Endpoints

#### GET /api/bank-transactions

Retrieve bank transactions with filtering and pagination.

**Query Parameters:**
- `accountId`: Filter by bank account (required)
- `startDate`: Filter from date (YYYY-MM-DD)
- `endDate`: Filter to date (YYYY-MM-DD)
- `search`: Search in transaction details
- `type`: Filter by type (Debit, Credit, or All)
- `minAmount`: Minimum amount filter
- `maxAmount`: Maximum amount filter
- `sortBy`: Field to sort (date, debitAmount, creditAmount, balance)
- `sortOrder`: asc or desc (default: desc)
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "transactionDate": "2026-03-15",
      "transactionDetails": "Dining Out",
      "debitAmount": 3500.00,
      "creditAmount": null,
      "balance": 177001.00
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 250,
    "totalPages": 5
  }
}
```

#### GET /api/credit-card-transactions

Retrieve credit card transactions with filtering and pagination.

**Query Parameters:** Similar to bank transactions, but:
- `type`: Filter by Debit or Credit
- `sortBy`: Field to sort (date, amount)
- Additional filters: `minAmount`, `maxAmount`, `search`

### Dashboard Endpoint

#### GET /api/dashboard/summary

Get summary statistics for the dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBankAccounts": 2,
    "totalCreditCards": 3,
    "totalTransactions": 350,
    "latestTransactionDate": "2026-03-20",
    "totalBankBalance": 395001.00,
    "currentPeriodIncome": 150000.00,
    "currentPeriodExpenses": 125000.00,
    "creditCardSpending": 82500.00
  }
}
```

## Application Navigation

### Dashboard
View financial overview and key metrics.

### Accounts
- **Bank Accounts**: View all bank accounts and their transaction history
- **Credit Cards**: View all credit cards and their transaction history

### Transactions
View and filter transactions for selected accounts with advanced filtering and sorting.

### Import Statements
Upload new CSV files for bank accounts and credit cards with help templates.

## File Upload Validation

### Validation Rules

- **File type**: Only CSV files accepted
- **File size**: Maximum 10 MB
- **CSV format**: Must have required headers
- **Required fields**: All required columns must be present
- **Data validation**:
  - Transaction dates must be valid
  - Amounts must be numeric
  - Type field must be Debit or Credit (credit cards only)

### Validation Error Handling

Invalid rows don't fail the entire import. Users see detailed errors:

```json
{
  "success": true,
  "accountId": "uuid",
  "rowsProcessed": 100,
  "newTransactions": 95,
  "duplicatesSkipped": 2,
  "invalidRows": [
    {
      "rowNumber": 15,
      "field": "Transaction Date",
      "value": "invalid-date",
      "error": "Invalid date format. Expected YYYY-MM-DD or MM/DD/YYYY"
    },
    {
      "rowNumber": 42,
      "field": "Amount",
      "value": "abc",
      "error": "Amount must be a valid number"
    }
  ]
}
```

## Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage

#### Backend
- CSV parsing and validation
- Bank/credit card CSV format validation
- Account creation and detection
- Transaction insertion and deduplication
- Filtering and sorting logic
- Date and amount parsing

#### Frontend
- CSV import form submission
- Help modal display
- Transaction filter functionality
- Pagination controls
- Loading and error states

### Sample Test Files

Located in `sample-data/`:
- `bank-statement.csv` - Sample bank transactions
- `credit-card-statement.csv` - Sample credit card transactions

## Troubleshooting

### Docker Issues

**Containers won't start:**
```bash
# Check logs
docker compose logs backend
docker compose logs frontend

# Rebuild from scratch
docker compose down -v
docker compose up --build
```

**PostgreSQL connection errors:**
- Ensure `DB_PASSWORD` and other database variables are correct in `.env`
- Wait for PostgreSQL to be healthy: `docker compose logs postgres`

### Database Issues

**Migration errors:**
```bash
# Reset database (destroys data)
cd backend
npm run db:reset
```

**Check database directly:**
```bash
# Connect to running PostgreSQL
docker compose exec postgres psql -U postgres -d personal_finance

# List tables
\dt

# View schema
\d bank_accounts
```

### API Connection Issues

**Frontend can't reach backend:**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running: `docker compose logs backend`
- Check network connectivity between containers

**CSV upload fails:**
- Verify file is in CSV format
- Check that all required columns are present
- Review browser console for error details

### Development Mode

**Hot reload not working:**
- Ensure volume mounts are correct in docker-compose.yml
- Restart containers: `docker compose restart`

**Changes not appearing:**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check that files are saved
- Verify volumes are mounted: `docker compose exec backend ls -la src/`

## Common Commands

```bash
# Start application
docker compose up --build

# Start in background
docker compose up -d --build

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop application
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v

# Enter backend container
docker compose exec backend bash

# Enter database
docker compose exec postgres psql -U postgres -d personal_finance

# Run backend tests
docker compose exec backend npm test

# Run database migrations
docker compose exec backend npm run db:migrate
```

## Database Schema

### Core Tables

#### bank_accounts
- `id`: UUID primary key
- `name`: Account name (unique)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

#### credit_cards
- `id`: UUID primary key
- `name`: Card name (unique)
- `createdAt`: Card creation timestamp
- `updatedAt`: Last update timestamp

#### bank_transactions
- `id`: UUID primary key
- `bankAccountId`: Foreign key to bank_accounts
- `transactionDate`: Date of transaction
- `transactionDetails`: Description
- `debitAmount`: Debit amount (nullable)
- `creditAmount`: Credit amount (nullable)
- `balance`: Account balance after transaction
- `fingerprint`: SHA-256 hash for duplicate detection (unique per account)
- `createdAt`: Import timestamp

**Indexes:**
- bankAccountId
- transactionDate
- fingerprint (unique with bankAccountId)

#### credit_card_transactions
- `id`: UUID primary key
- `creditCardId`: Foreign key to credit_cards
- `transactionDate`: Date of transaction
- `transactionDetails`: Description
- `amount`: Transaction amount
- `type`: Debit or Credit
- `fingerprint`: SHA-256 hash for duplicate detection (unique per card)
- `createdAt`: Import timestamp

**Indexes:**
- creditCardId
- transactionDate
- fingerprint (unique with creditCardId)

## Implementation Details

### Duplicate Detection Strategy

Transactions are identified by a composite fingerprint:

```typescript
// Bank transaction
const fingerprint = SHA256(
  `${bankAccountId}|${transactionDate}|${transactionDetails}|${debitAmount}|${creditAmount}|${balance}`
);

// Credit card transaction
const fingerprint = SHA256(
  `${creditCardId}|${transactionDate}|${transactionDetails}|${amount}|${type}`
);
```

This approach:
1. Allows multiple transactions on the same date
2. Uses database unique constraints for protection
3. Makes imports idempotent
4. Handles concurrent uploads safely
5. Enables efficient duplicate checking

### CSV Parsing Strategy

The application uses a robust CSV parser that:
1. Handles quoted values with embedded commas
2. Strips whitespace from headers
3. Validates required columns
4. Normalizes date formats (YYYY-MM-DD, MM/DD/YYYY)
5. Parses amounts with currency symbols and commas
6. Provides detailed row-level error messages

### Transaction Storage

Transactions are stored with:
- Original values preserved
- Parsed/normalized numeric values
- Database transaction support for atomicity
- Composite fingerprint for deduplication
- Timestamps for audit trails

## Assumptions

1. **Single user**: Application runs locally for one user (no authentication)
2. **CSV format**: Input CSVs follow specified formats strictly
3. **Database persistence**: PostgreSQL persists all data across restarts
4. **Timezone**: All dates stored in UTC
5. **Currency**: Application supports any currency (configured per user)
6. **Transaction immutability**: Transactions cannot be edited after import
7. **Concurrent imports**: Database constraints handle race conditions
8. **Local execution**: Application assumes all services run on same host

## Security Notes

✅ **Implemented:**
- Input validation on all CSV uploads
- Parameterized queries via Prisma ORM
- File type validation (CSV only)
- File size limits (10 MB max)
- No execution of uploaded files
- Environment variable for database credentials
- No sensitive data logging

⚠️ **Out of Scope:**
- User authentication (local app only)
- Authorization (single-user)
- HTTPS/TLS (local development)
- Encryption at rest (local app only)

## Project Structure

```
personal-finance-dashboard/
├── docker-compose.yml              # Docker service configuration
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # This file
│
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   ├── pages/                 # Page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API client functions
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # Entry point
│   ├── package.json               # Frontend dependencies
│   ├── tsconfig.json              # TypeScript config
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── Dockerfile                 # Frontend container
│
├── backend/                        # Express backend application
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── middleware/            # Express middleware
│   │   ├── utils/                 # Utility functions
│   │   ├── types/                 # TypeScript type definitions
│   │   └── server.ts              # Express server setup
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Database migrations
│   ├── tests/                     # Test files
│   ├── package.json               # Backend dependencies
│   ├── tsconfig.json              # TypeScript config
│   └── Dockerfile                 # Backend container
│
└── sample-data/                    # Example CSV files for testing
    ├── bank-statement.csv          # Sample bank transactions
    └── credit-card-statement.csv   # Sample credit card transactions
```

## License

MIT

## Support

For issues, questions, or feature requests, refer to the application documentation or check the console logs when running:

```bash
docker compose logs -f
```
