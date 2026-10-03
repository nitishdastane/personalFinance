const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function importBankStatement(csvContent: string) {
  const response = await fetch(`${API_BASE_URL}/import/bank`, {
    method: 'POST',
    body: csvContent,
  });
  return response.json();
}

export async function importCreditCardStatement(csvContent: string) {
  const response = await fetch(`${API_BASE_URL}/import/credit-card`, {
    method: 'POST',
    body: csvContent,
  });
  return response.json();
}

export async function getBankAccounts(limit = 50, offset = 0) {
  const response = await fetch(
    `${API_BASE_URL}/accounts/banks?limit=${limit}&offset=${offset}`
  );
  return response.json();
}

export async function getBankAccount(id: string) {
  const response = await fetch(`${API_BASE_URL}/accounts/banks/${id}`);
  return response.json();
}

export async function getCreditCards(limit = 50, offset = 0) {
  const response = await fetch(
    `${API_BASE_URL}/accounts/credit-cards?limit=${limit}&offset=${offset}`
  );
  return response.json();
}

export async function getCreditCard(id: string) {
  const response = await fetch(`${API_BASE_URL}/accounts/credit-cards/${id}`);
  return response.json();
}

export async function getBankTransactions(
  accountId: string,
  params: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    type?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortOrder?: string;
  } = {}
) {
  const searchParams = new URLSearchParams({
    accountId,
    page: (params.page || 1).toString(),
    pageSize: (params.pageSize || 50).toString(),
  });

  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);
  if (params.search) searchParams.append('search', params.search);
  if (params.type) searchParams.append('type', params.type);
  if (params.minAmount !== undefined) searchParams.append('minAmount', params.minAmount.toString());
  if (params.maxAmount !== undefined) searchParams.append('maxAmount', params.maxAmount.toString());
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/bank-transactions?${searchParams}`);
  return response.json();
}

export async function getCreditCardTransactions(
  accountId: string,
  params: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    type?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortOrder?: string;
  } = {}
) {
  const searchParams = new URLSearchParams({
    accountId,
    page: (params.page || 1).toString(),
    pageSize: (params.pageSize || 50).toString(),
  });

  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);
  if (params.search) searchParams.append('search', params.search);
  if (params.type) searchParams.append('type', params.type);
  if (params.minAmount !== undefined) searchParams.append('minAmount', params.minAmount.toString());
  if (params.maxAmount !== undefined) searchParams.append('maxAmount', params.maxAmount.toString());
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/credit-card-transactions?${searchParams}`);
  return response.json();
}

export async function getDashboardSummary() {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
  return response.json();
}
