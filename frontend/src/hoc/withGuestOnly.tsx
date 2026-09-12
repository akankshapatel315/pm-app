'use client';

import { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/current-user';

export function withGuestOnly<P extends object>(Component: ComponentType<P>) {
  function GuestOnlyRoute(props: P) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
      if (getStoredUser()) {
        router.replace('/projects');
        return;
      }
      setAllowed(true);
    }, [router]);

    if (!allowed) {
      return null;
    }

    return <Component {...props} />;
  }

  GuestOnlyRoute.displayName = `withGuestOnly(${Component.displayName || Component.name || 'Component'})`;

  return GuestOnlyRoute;
}
