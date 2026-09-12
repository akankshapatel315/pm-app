'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProjectsQuery } from '@/hooks/queries/useProjectsQuery';
import { ProjectList } from './ProjectList';

export function ProjectListContainer() {
  const user = useRequireAuth();
  const projectsQuery = useProjectsQuery(!!user);

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div className="flex gap-2">
          {user.role !== 'admin' && (
            <Button variant="outline" render={<Link href="/time-entries/new" />}>
              Log time
            </Button>
          )}
          {user.role === 'pm' && (
            <Button render={<Link href="/projects/new" />}>New project</Button>
          )}
        </div>
      </div>
      {projectsQuery.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {projectsQuery.isError && (
        <p className="text-sm text-destructive">
          {projectsQuery.error instanceof Error ? projectsQuery.error.message : 'Something went wrong'}
        </p>
      )}
      {projectsQuery.data && <ProjectList projects={projectsQuery.data} />}
    </div>
  );
}
