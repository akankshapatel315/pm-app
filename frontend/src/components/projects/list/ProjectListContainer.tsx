'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { listProjects, ProjectSummary } from '@/lib/projects-api';
import { ProjectList } from './ProjectList';

export function ProjectListContainer() {
  const user = useRequireAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    listProjects()
      .then(setProjects)
      .catch((err) => setError(err instanceof Error ? err.message : 'Something went wrong'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href="/time-entries/new" />}>
            Log time
          </Button>
          {user.role === 'pm' && (
            <Button render={<Link href="/projects/new" />}>New project</Button>
          )}
        </div>
      </div>
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && <ProjectList projects={projects} />}
    </div>
  );
}
