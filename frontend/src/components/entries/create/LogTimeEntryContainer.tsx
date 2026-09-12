'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProjectsQuery } from '@/hooks/queries/useProjectsQuery';
import { useCreateEntryMutation } from '@/hooks/mutations/useCreateEntryMutation';
import { LogTimeEntry, LogTimeEntryFormValues } from './LogTimeEntry';

export function LogTimeEntryContainer() {
  const user = useRequireAuth();
  const projectsQuery = useProjectsQuery(!!user);
  const createEntryMutation = useCreateEntryMutation();
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogTimeEntryFormValues>({
    defaultValues: { projectId: '', date: '', hours: '', notes: '' },
  });

  function onSubmit(values: LogTimeEntryFormValues) {
    setSuccess(null);
    createEntryMutation.mutate(
      {
        projectId: Number(values.projectId),
        date: values.date,
        hours: Number(values.hours),
        notes: values.notes || undefined,
      },
      {
        onSuccess: () => {
          setSuccess('Time entry logged.');
          reset({ projectId: values.projectId, date: '', hours: '', notes: '' });
        },
      }
    );
  }

  if (!user) {
    return null;
  }

  return (
    <LogTimeEntry
      projects={projectsQuery.data ?? []}
      projectsLoading={projectsQuery.isLoading}
      register={register}
      control={control}
      errors={errors}
      apiError={
        createEntryMutation.error instanceof Error ? createEntryMutation.error.message : null
      }
      success={success}
      loading={createEntryMutation.isPending}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
