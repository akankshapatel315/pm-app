import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/queryKeys';
import { updateProjectManager } from '@/lib/projects-api';

export function useUpdateProjectManagerMutation(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (managerId: number) => updateProjectManager(projectId, managerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
    },
  });
}
