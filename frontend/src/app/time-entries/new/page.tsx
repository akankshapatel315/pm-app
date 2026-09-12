'use client';

import { LogTimeEntryContainer } from '@/components/entries/create/LogTimeEntryContainer';
import { withAuth } from '@/hoc/withAuth';

function NewTimeEntryPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <LogTimeEntryContainer />
    </main>
  );
}

export default withAuth(NewTimeEntryPage);
