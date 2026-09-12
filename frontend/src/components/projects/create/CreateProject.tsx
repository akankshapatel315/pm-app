import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserSummary } from '@/lib/users-api';

export interface CreateProjectFormValues {
  name: string;
  clientName: string;
  monthlyHourCap: string;
  memberIds: number[];
}

export interface CreateProjectProps {
  register: UseFormRegister<CreateProjectFormValues>;
  control: Control<CreateProjectFormValues>;
  errors: FieldErrors<CreateProjectFormValues>;
  members: UserSummary[];
  membersLoading: boolean;
  apiError: string | null;
  loading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function CreateProject({
  register,
  control,
  errors,
  members,
  membersLoading,
  apiError,
  loading,
  onSubmit,
}: CreateProjectProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>Set up a project, its monthly hour cap, and who&apos;s on it.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" {...register('name', { required: 'Project name is required' })} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="clientName">Client name</Label>
            <Input
              id="clientName"
              {...register('clientName', { required: 'Client name is required' })}
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="monthlyHourCap">Monthly hour cap</Label>
            <Input
              id="monthlyHourCap"
              type="number"
              min={1}
              placeholder="e.g. 160"
              {...register('monthlyHourCap')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Members</Label>
            {membersLoading ? (
              <p className="text-sm text-muted-foreground">Loading members...</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members available to assign yet.</p>
            ) : (
              <Controller
                name="memberIds"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <>
                    <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border p-2">
                      {members.map((member) => {
                        const checked = field.value.includes(member.id);
                        return (
                          <label
                            key={member.id}
                            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() =>
                                field.onChange(
                                  checked
                                    ? field.value.filter((id) => id !== member.id)
                                    : [...field.value, member.id]
                                )
                              }
                            />
                            <span className="flex-1">{member.name}</span>
                            <span className="text-muted-foreground">{member.email}</span>
                          </label>
                        );
                      })}
                    </div>
                    {field.value.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {field.value.length} member{field.value.length === 1 ? '' : 's'} selected
                      </p>
                    )}
                  </>
                )}
              />
            )}
          </div>

          {apiError && <p className="text-sm text-destructive">{apiError}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
