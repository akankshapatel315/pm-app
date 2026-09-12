'use client';

import { RegisterContainer } from '@/components/auth/register/RegisterContainer';
import { withGuestOnly } from '@/hoc/withGuestOnly';

function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <RegisterContainer />
    </main>
  );
}

export default withGuestOnly(RegisterPage);
