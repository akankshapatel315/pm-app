const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type UserRole = 'admin' | 'pm' | 'member';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

async function handleAuthResponse(res: Response): Promise<AuthResponse> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data as AuthResponse;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleAuthResponse(res);
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleAuthResponse(res);
}
