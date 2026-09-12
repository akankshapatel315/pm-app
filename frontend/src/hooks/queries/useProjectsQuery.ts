import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/queryKeys';
import { listProjects } from '@/lib/projects-api';

export function useProjectsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: listProjects,
    enabled,
  });
}
