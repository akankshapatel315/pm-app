'use client';

import { ProjectDetailContainer } from '@/components/projects/detail/ProjectDetailContainer';
import { withAuth } from '@/hoc/withAuth';

function ProjectDetailPage() {
  return (
    <main className="flex min-h-screen justify-center p-8">
      <ProjectDetailContainer />
    </main>
  );
}

export default withAuth(ProjectDetailPage);
