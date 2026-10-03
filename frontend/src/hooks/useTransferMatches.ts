import { useQuery } from '@tanstack/react-query';
import { getTransferMatches } from '../services/api';

export function useTransferMatches(accountId?: string, creditCardId?: string) {
  return useQuery({
    queryKey: ['transferMatches', accountId || creditCardId],
    queryFn: () => {
      if (accountId) {
        return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/transfer-matches?accountId=${accountId}`).then(r => r.json());
      } else if (creditCardId) {
        return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/transfer-matches?creditCardId=${creditCardId}`).then(r => r.json());
      }
    },
    enabled: !!(accountId || creditCardId),
  });
}
