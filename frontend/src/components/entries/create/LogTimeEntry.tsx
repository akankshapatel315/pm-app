import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProjectSummary } from '@/lib/projects-api';

export interface LogTimeEntryProps {
  projects: ProjectSummary[];
  projectsLoading: boolean;
  projectId: string;
  date: string;
  hours: string;
  notes: string;
  error: string | null;
  success: string | null;
  loading: boolean;
  onProjectIdChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onHoursChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LogTimeEntry({
  projects,
  projectsLoading,
  projectId,
  date,
  hours,
  notes,
  error,
  success,
  loading,
  onProjectIdChange,
  onDateChange,
  onHoursChange,
  onNotesChange,
  onSubmit,
}: LogTimeEntryProps) {
  const noProjectsAssigned = !projectsLoading && projects.length === 0;

  return (
    <>
      <Dialog open={noProjectsAssigned}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Not assigned to any project</DialogTitle>
            <DialogDescription>
              You haven&apos;t been assigned to a project yet, so there&apos;s nothing to log time
              against. Ask your PM or admin to add you to a project first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button render={<Link href="/projects" />}>Back to projects</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log time</CardTitle>
          <CardDescription>Record hours worked on one of your assigned projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="project">Project</Label>
              <Select value={projectId} onValueChange={(value) => onProjectIdChange(value ?? '')}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project">
                    {(value: string | null) =>
                      projects.find((project) => String(project.id) === value)?.name ??
                      'Select a project'
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                step={1}
                value={hours}
                onChange={(e) => onHoursChange(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => onNotesChange(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
            <Button type="submit" disabled={loading || !projectId} className="w-full">
              {loading ? 'Logging...' : 'Log time'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
