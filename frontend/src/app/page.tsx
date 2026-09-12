'use client';

import { LoginContainer } from '@/components/auth/login/LoginContainer';
import { withGuestOnly } from '@/hoc/withGuestOnly';

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <LoginContainer />
    </main>
  );
}

export default withGuestOnly(Home);
