import { useQuery } from '@tanstack/react-query';
import { getBankTransactions, getCreditCardTransactions } from '../services/api';

export function useBankTransactions(filters: any) {
  return useQuery({
    queryKey: ['bankTransactions', filters],
    queryFn: () => {
      const { accountId, ...params } = filters;
      return getBankTransactions(accountId, params);
    },
  });
}

export function useCreditCardTransactions(filters: any) {
  return useQuery({
    queryKey: ['creditCardTransactions', filters],
    queryFn: () => {
      const { accountId, ...params } = filters;
      return getCreditCardTransactions(accountId, params);
    },
  });
}
