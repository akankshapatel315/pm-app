import { UserRole } from '@/lib/auth-api';

export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    detail: (id: number) => ['projects', id] as const,
  },
  users: {
    list: (role?: UserRole) => ['users', role ?? 'all'] as const,
  },
};
