import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/queryKeys';
import { UserRole } from '@/lib/auth-api';
import { listUsers } from '@/lib/users-api';

export function useUsersQuery(role?: UserRole, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.list(role),
    queryFn: () => listUsers(role),
    enabled,
  });
}
