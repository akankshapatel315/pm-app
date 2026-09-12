import { useMutation } from '@tanstack/react-query';
import { createEntry } from '@/lib/entries-api';

export function useCreateEntryMutation() {
  return useMutation({ mutationFn: createEntry });
}
