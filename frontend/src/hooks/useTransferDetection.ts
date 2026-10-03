import { useMutation, useQueryClient } from '@tanstack/react-query';
import { detectTransfers } from '../services/api';

export function useDetectTransfers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => detectTransfers(),
    onSuccess: () => {
      // Invalidate transaction queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['bankTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['creditCardTransactions'] });
    },
  });
}
