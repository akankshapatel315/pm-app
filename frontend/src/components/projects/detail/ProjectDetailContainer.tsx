'use client';

import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProjectQuery } from '@/hooks/queries/useProjectQuery';
import { useUsersQuery } from '@/hooks/queries/useUsersQuery';
import { useAddProjectMemberMutation } from '@/hooks/mutations/useAddProjectMemberMutation';
import { useUpdateProjectManagerMutation } from '@/hooks/mutations/useUpdateProjectManagerMutation';
import {
  AddMemberFormValues,
  ProjectDetail,
  ReassignManagerFormValues,
} from './ProjectDetail';

export function ProjectDetailContainer() {
  const user = useRequireAuth();
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  const projectQuery = useProjectQuery(projectId, !!user);
  const allMembersQuery = useUsersQuery('member', !!user);
  const managersQuery = useUsersQuery('pm', user?.role === 'admin');

  const addMemberMutation = useAddProjectMemberMutation(projectId);
  const updateManagerMutation = useUpdateProjectManagerMutation(projectId);

  const addMemberForm = useForm<AddMemberFormValues>({ defaultValues: { memberId: '' } });
  const reassignManagerForm = useForm<ReassignManagerFormValues>({
    defaultValues: { managerId: '' },
  });

  function handleAddMember(values: AddMemberFormValues) {
    addMemberMutation.mutate(Number(values.memberId), {
      onSuccess: () => addMemberForm.reset({ memberId: '' }),
    });
  }

  function handleReassignManager(values: ReassignManagerFormValues) {
    updateManagerMutation.mutate(Number(values.managerId), {
      onSuccess: () => reassignManagerForm.reset({ managerId: '' }),
    });
  }

  if (!user) return null;
  if (projectQuery.isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (projectQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {projectQuery.error instanceof Error ? projectQuery.error.message : 'Something went wrong'}
      </p>
    );
  }
  if (!projectQuery.data) return null;

  const data = projectQuery.data;
  const canManageMembers =
    user.role === 'admin' || data.project.createdBy === user.id || data.project.managerId === user.id;

  const assignedMemberIds = new Set(data.members.map((member) => member.id));
  const availableMembers = (allMembersQuery.data ?? []).filter(
    (member) => !assignedMemberIds.has(member.id)
  );

  return (
    <ProjectDetail
      data={data}
      canManageMembers={canManageMembers}
      availableMembers={availableMembers}
      addMemberControl={addMemberForm.control}
      addMemberError={
        addMemberMutation.error instanceof Error ? addMemberMutation.error.message : null
      }
      addMemberLoading={addMemberMutation.isPending}
      onAddMember={addMemberForm.handleSubmit(handleAddMember)}
      isAdmin={user.role === 'admin'}
      managers={managersQuery.data ?? []}
      reassignManagerControl={reassignManagerForm.control}
      managerError={
        updateManagerMutation.error instanceof Error ? updateManagerMutation.error.message : null
      }
      managerLoading={updateManagerMutation.isPending}
      onReassignManager={reassignManagerForm.handleSubmit(handleReassignManager)}
    />
  );
}
