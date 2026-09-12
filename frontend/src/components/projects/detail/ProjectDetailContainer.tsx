'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { addProjectMember, getProject, ProjectDetail as ProjectDetailData } from '@/lib/projects-api';
import { ProjectDetail } from './ProjectDetail';

export function ProjectDetailContainer() {
  const user = useRequireAuth();
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  const [data, setData] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMemberUserId, setNewMemberUserId] = useState('');
  const [addMemberError, setAddMemberError] = useState<string | null>(null);
  const [addMemberLoading, setAddMemberLoading] = useState(false);

  function loadProject() {
    setLoading(true);
    getProject(projectId)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Something went wrong'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!user) return;
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, projectId]);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setAddMemberError(null);
    setAddMemberLoading(true);

    try {
      await addProjectMember(projectId, Number(newMemberUserId));
      setNewMemberUserId('');
      loadProject();
    } catch (err) {
      setAddMemberError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setAddMemberLoading(false);
    }
  }

  if (!user) return null;
  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) return null;

  const canManageMembers =
    user.role === 'admin' || data.project.createdBy === user.id || data.project.managerId === user.id;

  return (
    <ProjectDetail
      data={data}
      canManageMembers={canManageMembers}
      newMemberUserId={newMemberUserId}
      addMemberError={addMemberError}
      addMemberLoading={addMemberLoading}
      onNewMemberUserIdChange={setNewMemberUserId}
      onAddMember={handleAddMember}
    />
  );
}
