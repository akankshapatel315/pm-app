'use client';

import { CreateProjectContainer } from '@/components/projects/create/CreateProjectContainer';
import { withAuth } from '@/hoc/withAuth';

function NewProjectPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <CreateProjectContainer />
    </main>
  );
}

export default withAuth(NewProjectPage);
