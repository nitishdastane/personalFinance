import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

export function useCategories(type?: 'income' | 'expense') {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => getCategories(type),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      type: 'income' | 'expense';
      icon?: string;
      color?: string;
    }) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      icon?: string;
      color?: string;
    }) => updateCategory(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
