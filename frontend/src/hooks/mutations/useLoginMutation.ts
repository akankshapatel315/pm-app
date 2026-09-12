import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '@/lib/auth-api';

export function useLoginMutation() {
  return useMutation({ mutationFn: loginRequest });
}
