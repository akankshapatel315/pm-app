import { authFetch } from '@/lib/api-client';
import { UserRole } from '@/lib/auth-api';

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export async function listUsers(role?: UserRole): Promise<UserSummary[]> {
  const query = role ? `?role=${role}` : '';
  const data = await authFetch<{ users: UserSummary[] }>(`/users${query}`);
  return data.users;
}
