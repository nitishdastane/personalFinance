import { useState } from 'react';
import { useBankTransactions, useCreditCardTransactions } from '../hooks/useTransactions';
import { useDetectTransfers } from '../hooks/useTransferDetection';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface TransactionsViewProps {
  accountId: string;
  type: 'bank' | 'card';
}

export default function TransactionsView({
  accountId,
  type,
}: TransactionsViewProps) {
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    transactionType: '',
  });
  const [sortBy, setSortBy] = useState('transactionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [detectMessage, setDetectMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const detectTransfersMutation = useDetectTransfers();

  const isBank = type === 'bank';
  const { data: bankData, isLoading: bankLoading } = useBankTransactions(
    isBank
      ? {
          accountId,
          ...filters,
          sortBy,
          sortOrder,
          page,
          pageSize: 20,
        }
      : { accountId: '', sortBy, sortOrder, page, pageSize: 20 }
  );

  const { data: cardData, isLoading: cardLoading } = useCreditCardTransactions(
    !isBank
      ? {
          accountId,
          ...filters,
          sortBy,
          sortOrder,
          page,
          pageSize: 20,
        }
      : { accountId: '', sortBy, sortOrder, page, pageSize: 20 }
  );

  const data = isBank ? bankData : cardData;
  const isLoading = isBank ? bankLoading : cardLoading;
  const transactions = data?.data || [];
  const total = data?.pagination?.total || 0;
  const pageCount = Math.ceil(total / 20);

  const handleDetectTransfers = async () => {
    setDetectMessage(null);
    try {
      const result = await detectTransfersMutation.mutateAsync();
      const found = result?.data?.found || 0;
      setDetectMessage({
        type: 'success',
        text: `Found ${found} internal transfers and marked them`,
      });
      setTimeout(() => setDetectMessage(null), 5000);
    } catch (error) {
      console.error('Transfer detection error:', error);
      setDetectMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to detect transfers',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isBank ? 'Bank' : 'Credit Card'} Transactions
          </h1>
          <p className="text-gray-600 mt-1">View and filter your transactions</p>
        </div>
        {isBank && (
          <Button
            onClick={handleDetectTransfers}
            disabled={detectTransfersMutation.isPending}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            🔍 {detectTransfersMutation.isPending ? 'Detecting...' : 'Detect Transfers'}
          </Button>
        )}
      </div>

      {detectMessage && (
        <div
          className={`p-3 rounded-lg text-sm ${
            detectMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {detectMessage.type === 'success' ? '✓' : '✗'} {detectMessage.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <Input
                type="text"
                placeholder="Description or reference"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Min Amount</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters({ ...filters, minAmount: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Max Amount</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters({ ...filters, maxAmount: e.target.value })
                }
              />
            </div>
            {isBank && (
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={filters.transactionType}
                  onChange={(e) =>
                    setFilters({ ...filters, transactionType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Debit">Debit</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              setFilters({
                search: '',
                startDate: '',
                endDate: '',
                minAmount: '',
                maxAmount: '',
                transactionType: '',
              });
              setPage(1);
            }}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {isLoading ? 'Loading...' : `${total} Transactions`}
            </CardTitle>
            <div className="space-x-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="transactionDate">Date</option>
                <option value="amount">Amount</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as 'asc' | 'desc');
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500 text-center py-8">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                    {isBank && <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>}
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Transfer Info</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((tx: any) => {
                    let amount = 0;
                    let type = '';
                    let isDebit = false;

                    if (isBank) {
                      // Bank transactions have debitAmount and creditAmount
                      isDebit = tx.debitAmount && tx.debitAmount > 0;
                      amount = isDebit ? tx.debitAmount : tx.creditAmount;
                      type = isDebit ? 'Debit' : 'Credit';
                    } else {
                      // Credit card transactions have amount and type
                      amount = tx.amount || 0;
                      type = tx.type || 'Debit';
                      isDebit = type === 'Debit';
                    }

                    return (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">
                          {tx.transactionDate}
                        </td>
                        <td className="px-4 py-2 text-gray-900">
                          {tx.transactionDetails || 'N/A'}
                        </td>
                        {isBank && (
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                !isDebit
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {type}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-2">
                          <select
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue="other"
                          >
                            <option value="other">—</option>
                            <option value="account-to-account">Account to Account</option>
                            <option value="credit-card-payment">Credit Card Payment</option>
                            <option value="groceries">Groceries</option>
                            <option value="food-dining">Food & Dining</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {/* Placeholder for From → To info */}
                          —
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {amount ? (
                            <span className={!isDebit ? 'text-green-600' : 'text-red-600'}>
                              ₹{amount.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={page === 1 ? 'opacity-50' : ''}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {pageCount}
              </span>
              <Button
                onClick={() => setPage(Math.min(pageCount, page + 1))}
                disabled={page === pageCount}
                className={page === pageCount ? 'opacity-50' : ''}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
