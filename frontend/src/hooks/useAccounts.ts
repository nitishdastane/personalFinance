import { useQuery } from '@tanstack/react-query';
import { getBankAccounts, getCreditCards } from '../services/api';

export function useBankAccounts() {
  return useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => getBankAccounts(),
  });
}

export function useCreditCards() {
  return useQuery({
    queryKey: ['creditCards'],
    queryFn: () => getCreditCards(),
  });
}
