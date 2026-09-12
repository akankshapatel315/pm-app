'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginRequest } from '@/lib/auth-api';
import { Login } from './Login';

export function LoginContainer() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await loginRequest({ email, password });
      localStorage.setItem('pm_app_token', token);
      localStorage.setItem('pm_app_user', JSON.stringify(user));
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Login
      email={email}
      password={password}
      error={error}
      loading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
