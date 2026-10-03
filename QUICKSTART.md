# Quick Start Guide

Get the Personal Finance Dashboard running in 5 minutes.

## Prerequisites

- Docker Desktop (includes Docker Compose)
- 2GB free disk space
- Modern web browser

No need to install Node.js, PostgreSQL, or anything else!

## Installation & Launch

### Step 1: Clone or Extract the Project

```bash
cd personal-finance-dashboard
```

### Step 2: Start the Application

```bash
docker compose up --build
```

This command:
- Pulls/builds container images
- Starts PostgreSQL database
- Starts backend API server
- Starts frontend development server
- Applies database migrations automatically

**First time may take 2-3 minutes.**

### Step 3: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

✅ **Application is ready to use!**

---

## Import Sample Data

### Option A: Use Sample CSVs (Recommended)

1. Navigate to **"Import Statements"** in the sidebar
2. Upload bank statement:
   - Click "Select CSV file" under Bank Statement
   - Select: `sample-data/bank-statement.csv`
   - Click "Import Bank Statement"
3. Upload credit card statement:
   - Click "Select CSV file" under Credit Card Statement
   - Select: `sample-data/credit-card-statement.csv`
   - Click "Import Credit Card Statement"

Wait for success messages. Then check the dashboard!

### Option B: Upload Your Own CSV

Ensure your CSV matches the required format:

**Bank Statement:**
```
Bank Name,Transaction Date,Transaction Details,Debit Amount,Credit Amount,Balance
HDFC Bank,2026-01-01,Opening Balance,,50000,50000
HDFC Bank,2026-01-02,ATM Withdrawal,5000,,45000
```

**Credit Card:**
```
Credit Card Name,Transaction Date,Transaction Details,Amount,Type
HDFC Card,2026-01-03,Amazon Purchase,2500,Debit
HDFC Card,2026-01-04,Cashback,100,Credit
```

---

## Navigation

### Dashboard
- View financial overview
- See total accounts, cards, transactions
- Check income/expense summary

### Accounts
- Browse all bank accounts
- Browse all credit cards
- See transaction counts and date ranges

### Import Statements
- Upload new CSV files
- View import results
- See help for CSV format

---

## Stop the Application

```bash
docker compose down
```

To also reset the database:

```bash
docker compose down -v
```

Then run `docker compose up --build` again to start fresh.

---

## Troubleshooting

### Application won't start

```bash
# View logs
docker compose logs

# Check specific service
docker compose logs backend
docker compose logs frontend
docker compose logs postgres
```

### Database connection error

```bash
# Make sure database is healthy
docker compose ps

# Should show "healthy" for postgres service
```

### Port already in use

If ports 3000 or 3001 are already in use:

1. Stop the application: `docker compose down`
2. Change ports in `docker-compose.yml`
3. Restart: `docker compose up --build`

### "Cannot connect to API"

1. Check backend is running: `docker compose logs backend`
2. Wait for "Backend server running on http://localhost:3001" message
3. Refresh browser page (Ctrl+F5 or Cmd+Shift+R)

---

## Example Workflows

### Import Your Bank Statements

1. Export statements from your bank as CSV
2. Go to **Import Statements**
3. Upload the CSV file
4. Review import summary
5. Check **Dashboard** to see totals
6. Click on account in **Accounts** to view transactions

### Filter Transactions

1. Go to **Accounts** → **Bank Accounts** (or Credit Cards)
2. Click on an account
3. Use filters (not yet in UI, use API directly):
   - Date range
   - Search text
   - Transaction type
   - Amount range

### View Summary Stats

1. Dashboard shows:
   - Total accounts and cards
   - Total transactions
   - Total balance
   - Income/expenses (last 30 days)
   - Credit card spending

---

## API Testing

### Test the Backend API

```bash
# Get dashboard summary
curl http://localhost:3001/api/dashboard/summary

# List bank accounts
curl http://localhost:3001/api/accounts/banks

# List credit cards
curl http://localhost:3001/api/accounts/credit-cards
```

---

## File Locations

| What | Where |
|------|-------|
| Frontend code | `frontend/src/` |
| Backend code | `backend/src/` |
| Database schema | `backend/prisma/schema.prisma` |
| Sample data | `sample-data/` |
| Configuration | `.env` |
| Documentation | `README.md` |

---

## Next Steps

- 📖 Read `README.md` for detailed documentation
- 🔍 Check `IMPLEMENTATION.md` for technical details
- ✅ See `REQUIREMENTS_CHECKLIST.md` for feature list
- 🗄️ Review database schema in `backend/prisma/schema.prisma`

---

## Support

### Check Logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Reset Everything

```bash
docker compose down -v
docker compose up --build
```

### View Database Directly

```bash
docker compose exec postgres psql -U postgres -d personal_finance

# In psql shell:
\dt                    # List tables
SELECT * FROM "BankAccount";  # View accounts
\q                     # Exit
```

---

**That's it! 🎉 Enjoy your Personal Finance Dashboard!**

For detailed information, refer to `README.md`.
