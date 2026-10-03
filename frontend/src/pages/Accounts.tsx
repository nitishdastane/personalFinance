import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBankAccounts, useCreditCards } from '../hooks/useAccounts';
import { Card, CardContent } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Upload, X } from 'lucide-react';
import { importBankStatement, importCreditCardStatement } from '../services/api';

interface AccountsProps {
  onAccountClick?: (accountId: string, type: 'bank' | 'card') => void;
}

export default function Accounts({ onAccountClick }: AccountsProps) {
  const queryClient = useQueryClient();
  const { data: bankData, isLoading: bankLoading } = useBankAccounts();
  const { data: cardData, isLoading: cardLoading } = useCreditCards();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<'bank' | 'card'>('bank');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    setImportMessage(null);

    try {
      const text = await selectedFile.text();
      const result =
        importType === 'bank'
          ? await importBankStatement(text)
          : await importCreditCardStatement(text);

      if (result.success) {
        setImportMessage({ type: 'success', text: `Successfully imported ${result.imported} transactions` });
        queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
        queryClient.invalidateQueries({ queryKey: ['creditCards'] });
        setSelectedFile(null);
        setTimeout(() => setShowImportModal(false), 1500);
      } else {
        setImportMessage({ type: 'error', text: result.error || 'Import failed' });
      }
    } catch (error) {
      setImportMessage({ type: 'error', text: error instanceof Error ? error.message : 'Import failed' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">View and manage your bank accounts and credit cards</p>
        </div>
        <Button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Upload size={18} />
          Import CSV
        </Button>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <Card className="w-full max-w-2xl my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Import Bank/Credit Card Statement</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Import Type Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Statement Type</label>
                  <select
                    value={importType}
                    onChange={(e) => setImportType(e.target.value as 'bank' | 'card')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bank">Bank Account</option>
                    <option value="card">Credit Card</option>
                  </select>
                </div>

                {/* CSV Template Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">CSV Format Required:</h3>
                  {importType === 'bank' ? (
                    <div>
                      <p className="text-sm text-blue-800 mb-2">Bank statements require these columns:</p>
                      <code className="text-xs bg-white p-2 block rounded border border-blue-200 mb-2 overflow-x-auto">
                        Bank Name, Transaction Date, Transaction Details, Debit Amount, Credit Amount, Balance
                      </code>
                      <p className="text-xs text-blue-700">
                        • Dates: YYYY-MM-DD or MM/DD/YYYY<br/>
                        • Use empty string for zero amounts<br/>
                        • Amounts: numeric format (e.g., 1000.00)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-blue-800 mb-2">Credit card statements require these columns:</p>
                      <code className="text-xs bg-white p-2 block rounded border border-blue-200 mb-2 overflow-x-auto">
                        Card Name, Transaction Date, Transaction Details, Amount, Type
                      </code>
                      <p className="text-xs text-blue-700">
                        • Dates: YYYY-MM-DD or MM/DD/YYYY<br/>
                        • Type: Debit or Credit<br/>
                        • Amounts: numeric format (e.g., 500.50)
                      </p>
                    </div>
                  )}
                </div>

                {/* File Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Select CSV File</label>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
                  )}
                </div>

                {/* Message */}
                {importMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      importMessage.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {importMessage.text}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleImport}
                    disabled={!selectedFile || importing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {importing ? 'Importing...' : 'Import'}
                  </Button>
                  <Button
                    onClick={() => setShowImportModal(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Tabs defaultValue="banks">
        <TabsList>
          <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
          <TabsTrigger value="cards">Credit Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="banks" className="mt-6 space-y-4">
          {bankLoading ? (
            <p className="text-gray-500">Loading bank accounts...</p>
          ) : bankData?.data?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No bank accounts yet</p>
              <p className="text-gray-500 text-sm">Import a bank statement to get started</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bankData?.data?.map((account: any) => (
                <Card
                  key={account.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onAccountClick?.(account.id, 'bank')}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {account.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-gray-600 text-sm">Transactions</p>
                            <p className="text-xl font-semibold text-gray-900">
                              {account.transactionCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Latest Balance</p>
                            <p className="text-xl font-semibold text-gray-900">
                              ₹{(account.latestBalance || 0).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Period</p>
                            <p className="text-sm text-gray-900">
                              {account.startDate} → {account.endDate || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Last Imported</p>
                            <p className="text-sm text-gray-900">
                              {account.lastImportedAt
                                ? new Date(account.lastImportedAt).toLocaleDateString()
                                : 'Never'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cards" className="mt-6 space-y-4">
          {cardLoading ? (
            <p className="text-gray-500">Loading credit cards...</p>
          ) : cardData?.data?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No credit cards yet</p>
              <p className="text-gray-500 text-sm">Import a credit card statement to get started</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {cardData?.data?.map((card: any) => (
                <Card
                  key={card.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onAccountClick?.(card.id, 'card')}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {card.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-gray-600 text-sm">Transactions</p>
                            <p className="text-xl font-semibold text-gray-900">
                              {card.transactionCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Period</p>
                            <p className="text-sm text-gray-900">
                              {card.startDate} → {card.endDate || 'N/A'}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-600 text-sm">Last Imported</p>
                            <p className="text-sm text-gray-900">
                              {card.lastImportedAt
                                ? new Date(card.lastImportedAt).toLocaleDateString()
                                : 'Never'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
