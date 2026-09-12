import { authFetch } from '@/lib/api-client';

export type CapStatus = 'ok' | 'warning' | 'over';

export interface ProjectSummary {
  id: number;
  name: string;
  clientName: string;
  monthlyHourCap: number | null;
  createdBy: number;
  managerId: number | null;
  hoursLogged: number;
  percentage: number | null;
  status: CapStatus;
}

export interface ProjectMemberUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ProjectDetail {
  project: {
    id: number;
    name: string;
    clientName: string;
    monthlyHourCap: number | null;
    createdBy: number;
    managerId: number | null;
  };
  members: ProjectMemberUser[];
  hoursLogged: number;
  percentage: number | null;
  status: CapStatus;
}

export interface CreateProjectPayload {
  name: string;
  clientName: string;
  monthlyHourCap: number | null;
}

export async function listProjects(): Promise<ProjectSummary[]> {
  const data = await authFetch<{ projects: ProjectSummary[] }>('/projects');
  return data.projects;
}

export async function getProject(id: number): Promise<ProjectDetail> {
  return authFetch<ProjectDetail>(`/projects/${id}`);
}

export async function createProject(payload: CreateProjectPayload): Promise<ProjectSummary> {
  const data = await authFetch<{ project: ProjectSummary }>('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.project;
}

export async function addProjectMember(projectId: number, userId: number): Promise<void> {
  await authFetch(`/projects/${projectId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}
