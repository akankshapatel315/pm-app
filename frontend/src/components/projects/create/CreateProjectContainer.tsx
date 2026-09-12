'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/lib/projects-api';
import { CreateProject } from './CreateProject';

export function CreateProjectContainer() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [monthlyHourCap, setMonthlyHourCap] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const project = await createProject({
        name,
        clientName,
        monthlyHourCap: monthlyHourCap ? Number(monthlyHourCap) : null,
      });
      router.push(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <CreateProject
      name={name}
      clientName={clientName}
      monthlyHourCap={monthlyHourCap}
      error={error}
      loading={loading}
      onNameChange={setName}
      onClientNameChange={setClientName}
      onMonthlyHourCapChange={setMonthlyHourCap}
      onSubmit={handleSubmit}
    />
  );
}
