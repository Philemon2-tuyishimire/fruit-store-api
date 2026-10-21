import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Fruit } from '../data/mockFruits';
import { FruitFormData } from '../schemas/fruit.schema';

const API_URL = 'http://localhost:5000/api/fruits';

// 1. Fetch all fruits (GET)
export function useFruits() {
  return useQuery({
    queryKey: ['fruits'],
    queryFn: async (): Promise<Fruit[]> => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch fruits from backend');
      return res.json();
    },
  });
}

// 2. Add a new fruit (POST)
export function useAddFruit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newFruit: FruitFormData) => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFruit),
      });
      if (!res.ok) throw new Error('Failed to create fruit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fruits'] });
    },
  });
}

// 3. Update an existing fruit (PUT)
export function useUpdateFruit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedFruit: Fruit) => {
      const res = await fetch(`${API_URL}/${updatedFruit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFruit),
      });
      if (!res.ok) throw new Error('Failed to update fruit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fruits'] });
    },
  });
}

// 4. Delete a fruit (DELETE)
export function useDeleteFruit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete fruit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fruits'] });
    },
  });
}