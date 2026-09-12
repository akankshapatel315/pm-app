'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/current-user';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getStoredUser() ? '/projects' : '/login');
  }, [router]);

  return null;
}
