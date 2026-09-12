'use client';

import { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/current-user';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  function ProtectedRoute(props: P) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      if (!getStoredUser()) {
        router.replace('/login');
        return;
      }
      setAuthorized(true);
    }, [router]);

    if (!authorized) {
      return null;
    }

    return <Component {...props} />;
  }

  ProtectedRoute.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return ProtectedRoute;
}
