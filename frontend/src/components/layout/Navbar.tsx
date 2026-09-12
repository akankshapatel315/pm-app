import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/lib/auth-api';

export interface NavbarProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <Link href={user ? '/projects' : '/login'} className="text-lg font-semibold">
        PM App
      </Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
              Projects
            </Link>
            {user.role !== 'admin' && (
              <Link href="/time-entries/new" className="text-sm text-muted-foreground hover:text-foreground">
                Log time
              </Link>
            )}
            {user.role === 'pm' && (
              <Link href="/projects/new" className="text-sm text-muted-foreground hover:text-foreground">
                New project
              </Link>
            )}
            <span className="text-sm text-muted-foreground">
              {user.name} ({user.role})
            </span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
