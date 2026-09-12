import Link from 'next/link';
import { Control, Controller, FieldErrors, UseFormRegister, useWatch } from 'react-hook-form';
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

export interface LogTimeEntryFormValues {
  projectId: string;
  date: string;
  hours: string;
  notes: string;
}

export interface LogTimeEntryProps {
  projects: ProjectSummary[];
  projectsLoading: boolean;
  register: UseFormRegister<LogTimeEntryFormValues>;
  control: Control<LogTimeEntryFormValues>;
  errors: FieldErrors<LogTimeEntryFormValues>;
  apiError: string | null;
  success: string | null;
  loading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function LogTimeEntry({
  projects,
  projectsLoading,
  register,
  control,
  errors,
  apiError,
  success,
  loading,
  onSubmit,
}: LogTimeEntryProps) {
  const noProjectsAssigned = !projectsLoading && projects.length === 0;
  const selectedProjectId = useWatch({ control, name: 'projectId' });

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
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="project">Project</Label>
              <Controller
                name="projectId"
                control={control}
                rules={{ required: 'Select a project' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value) => field.onChange(value ?? '')}>
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
                )}
              />
              {errors.projectId && (
                <p className="text-sm text-destructive">{errors.projectId.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={24}
                step={1}
                {...register('hours', {
                  required: 'Hours is required',
                  min: { value: 1, message: 'Must be at least 1 hour' },
                  max: { value: 24, message: 'Cannot exceed 24 hours in a day' },
                })}
              />
              {errors.hours && <p className="text-sm text-destructive">{errors.hours.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" {...register('notes')} />
            </div>
            {apiError && <p className="text-sm text-destructive">{apiError}</p>}
            {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
            <Button type="submit" disabled={loading || !selectedProjectId} className="w-full">
              {loading ? 'Logging...' : 'Log time'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
