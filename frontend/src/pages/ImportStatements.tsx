import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { HelpCircle, Upload } from 'lucide-react';
import { importBankStatement, importCreditCardStatement } from '../services/api';

export default function ImportStatements() {
  const queryClient = useQueryClient();
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [creditFile, setCreditFile] = useState<File | null>(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [creditLoading, setCreditLoading] = useState(false);
  const [bankResult, setBankResult] = useState<any>(null);
  const [creditResult, setCreditResult] = useState<any>(null);
  const [bankError, setBankError] = useState<string>('');
  const [creditError, setCreditError] = useState<string>('');
  const [showBankHelp, setShowBankHelp] = useState(false);
  const [showCreditHelp, setShowCreditHelp] = useState(false);

  const handleBankUpload = async (file: File) => {
    setBankFile(file);
    setBankError('');
    setBankResult(null);
  };

  const handleBankImport = async () => {
    if (!bankFile) return;

    setBankLoading(true);
    try {
      const text = await bankFile.text();
      const result = await importBankStatement(text);
      setBankResult(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      }
    } catch (error) {
      setBankError(error instanceof Error ? error.message : 'Failed to import');
    } finally {
      setBankLoading(false);
    }
  };

  const handleCreditUpload = async (file: File) => {
    setCreditFile(file);
    setCreditError('');
    setCreditResult(null);
  };

  const handleCreditImport = async () => {
    if (!creditFile) return;

    setCreditLoading(true);
    try {
      const text = await creditFile.text();
      const result = await importCreditCardStatement(text);
      setCreditResult(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['creditCards'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      }
    } catch (error) {
      setCreditError(error instanceof Error ? error.message : 'Failed to import');
    } finally {
      setCreditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Statements</h1>
        <p className="text-gray-600 mt-1">Upload CSV files to import transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Statement */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bank Statement</CardTitle>
              <button
                onClick={() => setShowBankHelp(!showBankHelp)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HelpCircle size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showBankHelp && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm">
                <h4 className="font-semibold text-blue-900 mb-2">CSV Format</h4>
                <p className="text-blue-800 mb-3">Required columns:</p>
                <ul className="list-disc list-inside text-blue-800 space-y-1 mb-3">
                  <li>Bank Name</li>
                  <li>Transaction Date (YYYY-MM-DD or MM/DD/YYYY)</li>
                  <li>Transaction Details</li>
                  <li>Debit Amount</li>
                  <li>Credit Amount</li>
                  <li>Balance</li>
                </ul>
                <p className="text-blue-800 text-xs mb-2 font-mono">
                  Example:<br/>
                  ABC Bank,2026-01-01,ATM Withdrawal,1000,,50000
                </p>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <label className="cursor-pointer block">
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <span className="text-gray-600">Select CSV file</span>
                <Input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleBankUpload(e.target.files[0])}
                />
              </label>
            </div>

            {bankFile && (
              <p className="text-sm text-gray-600">
                Selected: <strong>{bankFile.name}</strong>
              </p>
            )}

            {bankError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {bankError}
              </div>
            )}

            {bankResult && (
              <div className={`p-3 rounded-lg text-sm ${
                bankResult.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {bankResult.success ? (
                  <>
                    <p className="font-semibold">✓ Import completed</p>
                    <p className="mt-2">Account: {bankResult.accountName}</p>
                    <p>New transactions: {bankResult.newTransactions}</p>
                    <p>Duplicates skipped: {bankResult.duplicatesSkipped}</p>
                    <p>Period: {bankResult.transactionPeriod.startDate} → {bankResult.transactionPeriod.endDate}</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">✗ Import failed</p>
                    <p className="mt-1">{bankResult.error}</p>
                  </>
                )}
              </div>
            )}

            <Button
              onClick={handleBankImport}
              disabled={!bankFile || bankLoading}
              className="w-full"
            >
              {bankLoading ? 'Importing...' : 'Import Bank Statement'}
            </Button>
          </CardContent>
        </Card>

        {/* Credit Card Statement */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Credit Card Statement</CardTitle>
              <button
                onClick={() => setShowCreditHelp(!showCreditHelp)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HelpCircle size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showCreditHelp && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm">
                <h4 className="font-semibold text-blue-900 mb-2">CSV Format</h4>
                <p className="text-blue-800 mb-3">Required columns:</p>
                <ul className="list-disc list-inside text-blue-800 space-y-1 mb-3">
                  <li>Credit Card Name</li>
                  <li>Transaction Date (YYYY-MM-DD or MM/DD/YYYY)</li>
                  <li>Transaction Details</li>
                  <li>Amount</li>
                  <li>Type (Debit or Credit)</li>
                </ul>
                <p className="text-blue-800 text-xs mb-2 font-mono">
                  Example:<br/>
                  HDFC Card,2026-01-03,Amazon Purchase,2500,Debit
                </p>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <label className="cursor-pointer block">
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <span className="text-gray-600">Select CSV file</span>
                <Input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleCreditUpload(e.target.files[0])}
                />
              </label>
            </div>

            {creditFile && (
              <p className="text-sm text-gray-600">
                Selected: <strong>{creditFile.name}</strong>
              </p>
            )}

            {creditError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {creditError}
              </div>
            )}

            {creditResult && (
              <div className={`p-3 rounded-lg text-sm ${
                creditResult.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {creditResult.success ? (
                  <>
                    <p className="font-semibold">✓ Import completed</p>
                    <p className="mt-2">Account: {creditResult.accountName}</p>
                    <p>New transactions: {creditResult.newTransactions}</p>
                    <p>Duplicates skipped: {creditResult.duplicatesSkipped}</p>
                    <p>Period: {creditResult.transactionPeriod.startDate} → {creditResult.transactionPeriod.endDate}</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">✗ Import failed</p>
                    <p className="mt-1">{creditResult.error}</p>
                  </>
                )}
              </div>
            )}

            <Button
              onClick={handleCreditImport}
              disabled={!creditFile || creditLoading}
              className="w-full"
            >
              {creditLoading ? 'Importing...' : 'Import Credit Card Statement'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
