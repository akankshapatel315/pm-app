import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/queryKeys';
import { getProject } from '@/lib/projects-api';

export function useProjectQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => getProject(id),
    enabled: enabled && Number.isFinite(id),
  });
}
