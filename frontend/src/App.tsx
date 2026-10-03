import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import TransactionsView from './pages/TransactionsView';
import Categories from './pages/Categories';
import { Menu, X, Home, LayoutGrid, ArrowLeft, Tag } from 'lucide-react';

const queryClient = new QueryClient();

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionFilters, setTransactionFilters] = useState<{
    accountId: string;
    type: 'bank' | 'card';
  } | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: LayoutGrid },
    { id: 'categories', label: 'Categories', icon: Tag },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } md:w-64 bg-gray-900 text-white transition-all duration-300 overflow-hidden md:relative fixed h-full z-40`}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold">💰 Finance</h1>
          </div>

          <nav className="space-y-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between md:justify-end">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-700"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-gray-600 text-sm">
              Personal Finance Dashboard
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            {currentPage === 'transactions' && transactionFilters && (
              <div>
                <button
                  onClick={() => {
                    setCurrentPage('accounts');
                    setTransactionFilters(null);
                  }}
                  className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft size={20} />
                  Back to Accounts
                </button>
                <TransactionsView
                  accountId={transactionFilters.accountId}
                  type={transactionFilters.type}
                />
              </div>
            )}
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'accounts' && (
              <Accounts
                onAccountClick={(accountId: string, type: 'bank' | 'card') => {
                  setTransactionFilters({ accountId, type });
                  setCurrentPage('transactions');
                }}
              />
            )}
            {currentPage === 'categories' && <Categories />}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
