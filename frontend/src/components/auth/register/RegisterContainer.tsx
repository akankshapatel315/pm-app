'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerRequest } from '@/lib/auth-api';
import { Register } from './Register';

export function RegisterContainer() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await registerRequest({ name, email, password });
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
    <Register
      name={name}
      email={email}
      password={password}
      error={error}
      loading={loading}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
