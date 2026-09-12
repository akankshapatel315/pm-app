'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthUser } from '@/lib/auth-api';
import { getStoredUser } from '@/lib/current-user';
import { Navbar } from './Navbar';

const HIDDEN_ON = ['/login', '/register'];

export function NavbarContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem('pm_app_token');
    localStorage.removeItem('pm_app_user');
    setUser(null);
    router.push('/login');
  }

  if (HIDDEN_ON.includes(pathname)) {
    return null;
  }

  return <Navbar user={user} onLogout={handleLogout} />;
}
