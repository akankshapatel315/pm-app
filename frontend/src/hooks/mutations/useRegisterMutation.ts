import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '@/lib/auth-api';

export function useRegisterMutation() {
  return useMutation({ mutationFn: registerRequest });
}
