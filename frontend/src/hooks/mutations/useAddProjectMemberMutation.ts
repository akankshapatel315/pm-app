import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/queryKeys';
import { addProjectMember } from '@/lib/projects-api';

export function useAddProjectMemberMutation(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => addProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
    },
  });
}
