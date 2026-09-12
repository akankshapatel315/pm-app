'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { createEntry } from '@/lib/entries-api';
import { listProjects, ProjectSummary } from '@/lib/projects-api';
import { LogTimeEntry } from './LogTimeEntry';

export function LogTimeEntryContainer() {
  const user = useRequireAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    listProjects().catch(() => []).then((result) => setProjects(result ?? []));
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await createEntry({
        projectId: Number(projectId),
        date,
        hours: Number(hours),
        notes: notes || undefined,
      });
      setSuccess('Time entry logged.');
      setHours('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <LogTimeEntry
      projects={projects}
      projectId={projectId}
      date={date}
      hours={hours}
      notes={notes}
      error={error}
      success={success}
      loading={loading}
      onProjectIdChange={setProjectId}
      onDateChange={setDate}
      onHoursChange={setHours}
      onNotesChange={setNotes}
      onSubmit={handleSubmit}
    />
  );
}
