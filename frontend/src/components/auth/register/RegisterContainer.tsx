'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/hooks/mutations/useRegisterMutation';
import { Register, RegisterFormValues } from './Register';

export function RegisterContainer() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ defaultValues: { role: 'member' } });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values, {
      onSuccess: ({ token, user }) => {
        localStorage.setItem('pm_app_token', token);
        localStorage.setItem('pm_app_user', JSON.stringify(user));
        router.push('/projects');
      },
    });
  }

  return (
    <Register
      register={register}
      control={control}
      errors={errors}
      apiError={registerMutation.error instanceof Error ? registerMutation.error.message : null}
      loading={registerMutation.isPending}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
