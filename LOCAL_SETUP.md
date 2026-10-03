# Local Setup Guide (Without Docker)

Complete step-by-step guide to run the Personal Finance Dashboard locally on your macOS machine.

## Prerequisites

Install these if you don't have them:

```bash
# Node.js (18+)
brew install node

# PostgreSQL (16)
brew install postgresql@16

# Verify installations
node --version
npm --version
psql --version
```

## Step 1: Start PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql@16

# Verify it's running
psql postgres -c "SELECT version();"
```

## Step 2: Create Database

```bash
# Create database and user
createdb personal_finance
psql personal_finance -c "CREATE USER dev_user WITH PASSWORD 'dev_password';"
psql personal_finance -c "GRANT ALL PRIVILEGES ON DATABASE personal_finance TO dev_user;"
psql personal_finance -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dev_user;"
psql personal_finance -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dev_user;"
```

## Step 3: Install Backend Dependencies

```bash
cd /Users/nitishd/Study/personalFinance/backend

# Install packages
npm install

# Run database migrations
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/personal_finance" npm run db:migrate

# Verify migrations ran
psql personal_finance -c "\dt"
```

You should see tables:
- BankAccount
- CreditCard
- BankTransaction
- CreditCardTransaction

## Step 4: Start Backend Server

In a terminal, run:

```bash
cd /Users/nitishd/Study/personalFinance/backend

DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/personal_finance" \
NODE_ENV=development \
PORT=3001 \
npm run dev
```

You should see:
```
✓ Server running on http://localhost:3001
```

## Step 5: Install Frontend Dependencies

In a **new terminal**:

```bash
cd /Users/nitishd/Study/personalFinance/frontend

npm install
```

## Step 6: Start Frontend Dev Server

```bash
cd /Users/nitishd/Study/personalFinance/frontend

npm run dev
```

Or with explicit API URL:
```bash
VITE_API_URL=http://localhost:3001/api npm run dev
```

You should see:
```
➜  Local:   http://localhost:3000/
```

## Step 7: Open Application

Open browser: **http://localhost:3000**

You should see the Personal Finance Dashboard! 🎉

## Step 8: Test Import

1. Click **"Import Statements"**
2. Upload bank statement: `/Users/nitishd/Study/personalFinance/sample-data/bank-statement.csv`
3. Upload credit card: `/Users/nitishd/Study/personalFinance/sample-data/credit-card-statement.csv`
4. Check **Dashboard** for imported data

---

## Testing API Directly

```bash
# Health check
curl http://localhost:3001/health

# Dashboard summary
curl http://localhost:3001/api/dashboard/summary

# List bank accounts (after importing)
curl http://localhost:3001/api/accounts/banks

# List credit cards
curl http://localhost:3001/api/accounts/credit-cards
```

---

## Stopping Services

### Stop Backend
- Press `Ctrl+C` in backend terminal

### Stop Frontend
- Press `Ctrl+C` in frontend terminal

### Stop PostgreSQL
```bash
brew services stop postgresql@16
```

---

## Resetting Database

```bash
# Drop database
dropdb personal_finance

# Recreate (follow Step 2 and Step 3)
createdb personal_finance
psql personal_finance -c "CREATE USER dev_user WITH PASSWORD 'dev_password';"
# ... etc
```

---

## Troubleshooting

### "Port 3001 already in use"
```bash
lsof -i :3001
kill -9 <PID>
```

### "Port 3000 already in use"
```bash
lsof -i :3000
kill -9 <PID>
```

### "PostgreSQL not running"
```bash
brew services start postgresql@16
```

### "Database connection refused"
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Restart if needed
brew services restart postgresql@16
```

### "Cannot find module..."
```bash
cd backend  # or frontend
rm -rf node_modules
npm install
```

---

## File Structure Used

```
/Users/nitishd/Study/personalFinance/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
└── sample-data/
    ├── bank-statement.csv
    └── credit-card-statement.csv
```

---

## Environment Variables

**Backend (.env or in terminal):**
```
DATABASE_URL=postgresql://dev_user:dev_password@localhost:5432/personal_finance
NODE_ENV=development
PORT=3001
```

**Frontend (.env or in terminal):**
```
VITE_API_URL=http://localhost:3001
```

---

## Development Tips

### Hot Reload
Both services support hot reload:
- Edit backend files → server auto-recompiles
- Edit frontend files → browser auto-refreshes

### Database Inspection
```bash
# Connect to database
psql personal_finance

# List tables
\dt

# View bank accounts
SELECT * FROM "BankAccount";

# View transactions
SELECT * FROM "BankTransaction" LIMIT 10;

# Exit
\q
```

### View Logs
- Backend: Check terminal where `npm run dev` is running
- Frontend: Check browser console (F12)

---

## Next Steps

1. Import your own bank/credit card CSV files
2. Explore the dashboard and accounts
3. Try filtering transactions
4. Modify code and see hot reload in action

Enjoy! 🚀
