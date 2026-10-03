import http from 'http';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { importBankStatement, importCreditCardStatement } from './services/importService';
import { getBankAccounts, getCreditCards } from './services/accountService';
import { getBankTransactions, getCreditCardTransactions } from './services/transactionService';
import { getDashboardSummary } from './services/dashboardService';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from './services/categoryService';
import { detectTransfers, getTransferPatterns, addTransferPattern, updateTransferPattern, deleteTransferPattern } from './services/transferService';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001');
const prisma = new PrismaClient();

function parseUrl(url: string) {
  const [path, query] = url.split('?');
  const params = new URLSearchParams(query || '');
  return { path, params };
}

const server = http.createServer(async (req, res) => {
  const { path, params } = parseUrl(req.url || '/');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Health check
    if (path === '/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    // Dashboard
    if (path === '/api/dashboard/summary' && req.method === 'GET') {
      const data = await getDashboardSummary();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data }));
      return;
    }

    // Bank accounts
    if (path === '/api/accounts/banks' && req.method === 'GET') {
      const limit = parseInt(params.get('limit') || '50');
      const offset = parseInt(params.get('offset') || '0');
      const result = await getBankAccounts(limit, offset);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, ...result }));
      return;
    }

    // Credit cards
    if (path === '/api/accounts/credit-cards' && req.method === 'GET') {
      const limit = parseInt(params.get('limit') || '50');
      const offset = parseInt(params.get('offset') || '0');
      const result = await getCreditCards(limit, offset);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, ...result }));
      return;
    }

    // Bank transactions
    if (path === '/api/bank-transactions' && req.method === 'GET') {
      const accountId = params.get('accountId');
      if (!accountId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'accountId required' }));
        return;
      }
      const result = await getBankTransactions({
        accountId,
        startDate: params.get('startDate') || undefined,
        endDate: params.get('endDate') || undefined,
        search: params.get('search') || undefined,
        type: params.get('type') || undefined,
        minAmount: params.get('minAmount') ? parseFloat(params.get('minAmount')!) : undefined,
        maxAmount: params.get('maxAmount') ? parseFloat(params.get('maxAmount')!) : undefined,
        sortBy: params.get('sortBy') || 'transactionDate',
        sortOrder: (params.get('sortOrder') as any) || 'desc',
        page: parseInt(params.get('page') || '1'),
        pageSize: parseInt(params.get('pageSize') || '50'),
      });
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, ...result }));
      return;
    }

    // Credit card transactions
    if (path === '/api/credit-card-transactions' && req.method === 'GET') {
      const accountId = params.get('accountId');
      if (!accountId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'accountId required' }));
        return;
      }
      const result = await getCreditCardTransactions({
        accountId,
        startDate: params.get('startDate') || undefined,
        endDate: params.get('endDate') || undefined,
        search: params.get('search') || undefined,
        type: params.get('type') || undefined,
        minAmount: params.get('minAmount') ? parseFloat(params.get('minAmount')!) : undefined,
        maxAmount: params.get('maxAmount') ? parseFloat(params.get('maxAmount')!) : undefined,
        sortBy: params.get('sortBy') || 'transactionDate',
        sortOrder: (params.get('sortOrder') as any) || 'desc',
        page: parseInt(params.get('page') || '1'),
        pageSize: parseInt(params.get('pageSize') || '50'),
      });
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, ...result }));
      return;
    }

    // Categories - GET all
    if (path === '/api/categories' && req.method === 'GET') {
      const type = params.get('type') as any;
      const categories = await getAllCategories(type);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: categories }));
      return;
    }

    // Categories - POST create
    if (path === '/api/categories' && req.method === 'POST') {
      const chunks: Buffer[] = [];
      req.on('data', chunk => { chunks.push(chunk); });
      req.on('end', async () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
          const { name, type, icon, color } = body;
          if (!name || !type) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'name and type required' }));
            return;
          }
          const category = await createCategory(name, type, icon, color);
          res.writeHead(201);
          res.end(JSON.stringify({ success: true, data: category }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: (error as Error).message }));
        }
      });
      return;
    }

    // Categories - PATCH update
    if (path.startsWith('/api/categories/') && req.method === 'PATCH') {
      const id = path.split('/')[3];
      const chunks: Buffer[] = [];
      req.on('data', chunk => { chunks.push(chunk); });
      req.on('end', async () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
          const category = await updateCategory(id, body);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, data: category }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: (error as Error).message }));
        }
      });
      return;
    }

    // Categories - DELETE
    if (path.startsWith('/api/categories/') && req.method === 'DELETE') {
      const id = path.split('/')[3];
      try {
        const category = await deleteCategory(id);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: category }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: (error as Error).message }));
      }
      return;
    }

    // Bank import
    if (path === '/api/import/bank' && req.method === 'POST') {
      const chunks: Buffer[] = [];
      req.on('data', chunk => { chunks.push(chunk); });
      req.on('end', async () => {
        try {
          const body = Buffer.concat(chunks).toString('utf-8');
          const result = await importBankStatement(body);
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: (error as Error).message }));
        }
      });
      req.on('error', (error) => {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: error.message }));
      });
      return;
    }

    // Credit card import
    if (path === '/api/import/credit-card' && req.method === 'POST') {
      const chunks: Buffer[] = [];
      req.on('data', chunk => { chunks.push(chunk); });
      req.on('end', async () => {
        try {
          const body = Buffer.concat(chunks).toString('utf-8');
          const result = await importCreditCardStatement(body);
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: (error as Error).message }));
        }
      });
      req.on('error', (error) => {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: error.message }));
      });
      return;
    }

    // Transfers - Detect transfers
    if (path === '/api/transfers/detect' && req.method === 'POST') {
      try {
        const result = await detectTransfers();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: result }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: (error as Error).message }));
      }
      return;
    }

    // Transfers - Get transfer matches for an account or credit card
    if (path === '/api/transfer-matches' && req.method === 'GET') {
      try {
        const accountId = params.get('accountId');
        const creditCardId = params.get('creditCardId');

        if (!accountId && !creditCardId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'accountId or creditCardId required' }));
          return;
        }

        const whereCondition: any = {};
        if (accountId) {
          whereCondition.OR = [
            { sourceBankAccountId: accountId },
            { targetBankAccountId: accountId },
            { targetBankAccountId2: accountId },
          ];
        } else if (creditCardId) {
          whereCondition.targetCreditCardId = creditCardId;
        }

        const matches = await prisma.transferMatch.findMany({
          where: whereCondition,
          include: {
            sourceBankAccount: true,
            targetBankAccount: true,
            paymentFromAccount: true,
            targetCreditCard: true,
          },
        });
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: matches }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: (error as Error).message }));
      }
      return;
    }

    // Transfer Patterns - GET all
    if (path === '/api/transfer-patterns' && req.method === 'GET') {
      try {
        const patterns = await getTransferPatterns();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: patterns }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: (error as Error).message }));
      }
      return;
    }

    // Transfer Patterns - POST create
    if (path === '/api/transfer-patterns' && req.method === 'POST') {
      const chunks: Buffer[] = [];
      req.on('data', chunk => { chunks.push(chunk); });
      req.on('end', async () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
          const { pattern, targetBankName, description } = body;
          if (!pattern || !targetBankName) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'pattern and targetBankName required' }));
            return;
          }
          const result = await addTransferPattern(pattern, targetBankName, description);
          res.writeHead(201);
          res.end(JSON.stringify({ success: true, data: result }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: (error as Error).message }));
        }
      });
      return;
    }

    // Transfer Patterns - PATCH update
    if (path.startsWith('/api/transfer-patterns/') && req.method === 'PATCH') {
      const id = path.split('/')[3];
      const chunks: Buffer[] = [];
      req.on('data', chunk => { chunks.push(chunk); });
      req.on('end', async () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
          const result = await updateTransferPattern(id, body);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, data: result }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: (error as Error).message }));
        }
      });
      return;
    }

    // Transfer Patterns - DELETE
    if (path.startsWith('/api/transfer-patterns/') && req.method === 'DELETE') {
      const id = path.split('/')[3];
      try {
        const result = await deleteTransferPattern(id);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: result }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: (error as Error).message }));
      }
      return;
    }

    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
