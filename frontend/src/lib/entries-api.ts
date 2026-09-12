import { authFetch } from '@/lib/api-client';

export interface TimeEntry {
  id: number;
  notes: string | null;
  userId: number;
  projectId: number;
  date: string;
  hours: number;
}

export interface CreateEntryPayload {
  projectId: number;
  date: string;
  hours: number;
  notes?: string;
}

export async function createEntry(payload: CreateEntryPayload): Promise<TimeEntry> {
  const data = await authFetch<{ entry: TimeEntry }>('/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.entry;
}

export async function listMyEntries(): Promise<TimeEntry[]> {
  const data = await authFetch<{ entries: TimeEntry[] }>('/entries/me');
  return data.entries;
}
