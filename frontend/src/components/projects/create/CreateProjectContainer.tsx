'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { useCreateProjectMutation } from '@/hooks/mutations/useCreateProjectMutation';
import { CreateProject, CreateProjectFormValues } from './CreateProject';

export function CreateProjectContainer() {
  const user = useRequireAuth();
  const router = useRouter();
  const isPm = user?.role === 'pm';

  const membersQuery = useUsersQuery('member', isPm);
  const createProjectMutation = useCreateProjectMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    defaultValues: { name: '', clientName: '', monthlyHourCap: '', memberIds: [] },
  });

  function onSubmit(values: CreateProjectFormValues) {
    createProjectMutation.mutate(
      {
        name: values.name,
        clientName: values.clientName,
        monthlyHourCap: values.monthlyHourCap ? Number(values.monthlyHourCap) : null,
        memberIds: values.memberIds,
      },
      {
        onSuccess: (project) => {
          router.push(`/projects/${project.id}`);
        },
      }
    );
  }

  if (!user) {
    return null;
  }

  if (!isPm) {
    return (
      <p className="text-sm text-muted-foreground">
        Only PMs can create projects. Ask an admin to assign you as manager of an existing project
        instead.
      </p>
    );
  }

  return (
    <CreateProject
      register={register}
      control={control}
      errors={errors}
      members={membersQuery.data ?? []}
      membersLoading={membersQuery.isLoading}
      apiError={createProjectMutation.error instanceof Error ? createProjectMutation.error.message : null}
      loading={createProjectMutation.isPending}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
