'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/hooks/mutations/useLoginMutation';
import { Login, LoginFormValues } from './Login';

export function LoginContainer() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: ({ token, user }) => {
        localStorage.setItem('pm_app_token', token);
        localStorage.setItem('pm_app_user', JSON.stringify(user));
        router.push('/projects');
      },
    });
  }

  return (
    <Login
      register={register}
      errors={errors}
      apiError={loginMutation.error instanceof Error ? loginMutation.error.message : null}
      loading={loginMutation.isPending}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
