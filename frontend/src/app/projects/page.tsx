'use client';

import { ProjectListContainer } from '@/components/projects/list/ProjectListContainer';
import { withAuth } from '@/hoc/withAuth';

function ProjectsPage() {
  return (
    <main className="flex min-h-screen justify-center p-8">
      <ProjectListContainer />
    </main>
  );
}

export default withAuth(ProjectsPage);
