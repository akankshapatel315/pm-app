'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import {
  addProjectMember,
  getProject,
  ProjectDetail as ProjectDetailData,
  updateProjectManager,
} from '@/lib/projects-api';
import { listUsers, UserSummary } from '@/lib/users-api';
import { ProjectDetail } from './ProjectDetail';

export function ProjectDetailContainer() {
  const user = useRequireAuth();
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  const [data, setData] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allMembers, setAllMembers] = useState<UserSummary[]>([]);
  const [selectedNewMemberId, setSelectedNewMemberId] = useState('');
  const [addMemberError, setAddMemberError] = useState<string | null>(null);
  const [addMemberLoading, setAddMemberLoading] = useState(false);

  const [managers, setManagers] = useState<UserSummary[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [managerError, setManagerError] = useState<string | null>(null);
  const [managerLoading, setManagerLoading] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    listUsers('member').then(setAllMembers).catch(() => setAllMembers([]));
    if (user.role === 'admin') {
      listUsers('pm').then(setManagers).catch(() => setManagers([]));
    }
  }, [user]);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setAddMemberError(null);
    setAddMemberLoading(true);

    try {
      await addProjectMember(projectId, Number(selectedNewMemberId));
      setSelectedNewMemberId('');
      loadProject();
    } catch (err) {
      setAddMemberError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setAddMemberLoading(false);
    }
  }

  async function handleReassignManager(e: React.FormEvent) {
    e.preventDefault();
    setManagerError(null);
    setManagerLoading(true);

    try {
      await updateProjectManager(projectId, Number(selectedManagerId));
      setSelectedManagerId('');
      loadProject();
    } catch (err) {
      setManagerError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setManagerLoading(false);
    }
  }

  if (!user) return null;
  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) return null;

  const canManageMembers =
    user.role === 'admin' || data.project.createdBy === user.id || data.project.managerId === user.id;

  const assignedMemberIds = new Set(data.members.map((member) => member.id));
  const availableMembers = allMembers.filter((member) => !assignedMemberIds.has(member.id));

  return (
    <ProjectDetail
      data={data}
      canManageMembers={canManageMembers}
      availableMembers={availableMembers}
      selectedNewMemberId={selectedNewMemberId}
      addMemberError={addMemberError}
      addMemberLoading={addMemberLoading}
      onSelectedNewMemberIdChange={setSelectedNewMemberId}
      onAddMember={handleAddMember}
      isAdmin={user.role === 'admin'}
      managers={managers}
      selectedManagerId={selectedManagerId}
      managerError={managerError}
      managerLoading={managerLoading}
      onSelectedManagerIdChange={setSelectedManagerId}
      onReassignManager={handleReassignManager}
    />
  );
}
