'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { createProject } from '@/lib/projects-api';
import { listUsers, UserSummary } from '@/lib/users-api';
import { CreateProject } from './CreateProject';

export function CreateProjectContainer() {
  const user = useRequireAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [monthlyHourCap, setMonthlyHourCap] = useState('');
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'pm') return;

    listUsers('member')
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));
  }, [user]);

  function toggleMember(id: number) {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const project = await createProject({
        name,
        clientName,
        monthlyHourCap: monthlyHourCap ? Number(monthlyHourCap) : null,
        memberIds: selectedMemberIds,
      });
      router.push(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'pm') {
    return (
      <p className="text-sm text-muted-foreground">
        Only PMs can create projects. Ask an admin to assign you as manager of an existing project
        instead.
      </p>
    );
  }

  return (
    <CreateProject
      name={name}
      clientName={clientName}
      monthlyHourCap={monthlyHourCap}
      members={members}
      membersLoading={membersLoading}
      selectedMemberIds={selectedMemberIds}
      error={error}
      loading={loading}
      onNameChange={setName}
      onClientNameChange={setClientName}
      onMonthlyHourCapChange={setMonthlyHourCap}
      onToggleMember={toggleMember}
      onSubmit={handleSubmit}
    />
  );
}
