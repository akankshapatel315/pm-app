import { Control, Controller, useWatch } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CapStatus, ProjectDetail as ProjectDetailData } from '@/lib/projects-api';
import { UserSummary } from '@/lib/users-api';

const STATUS_STYLES: Record<CapStatus, { label: string; badgeClass: string; barClass: string }> = {
  ok: {
    label: 'On track',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    barClass: '[&_[data-slot=progress-indicator]]:bg-emerald-500',
  },
  warning: {
    label: 'Near cap',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    barClass: '[&_[data-slot=progress-indicator]]:bg-amber-500',
  },
  over: {
    label: 'Over cap',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    barClass: '[&_[data-slot=progress-indicator]]:bg-red-500',
  },
};

export interface AddMemberFormValues {
  memberId: string;
}

export interface ReassignManagerFormValues {
  managerId: string;
}

export interface ProjectDetailProps {
  data: ProjectDetailData;
  canManageMembers: boolean;
  availableMembers: UserSummary[];
  addMemberControl: Control<AddMemberFormValues>;
  addMemberError: string | null;
  addMemberLoading: boolean;
  onAddMember: React.FormEventHandler<HTMLFormElement>;
  isAdmin: boolean;
  managers: UserSummary[];
  reassignManagerControl: Control<ReassignManagerFormValues>;
  managerError: string | null;
  managerLoading: boolean;
  onReassignManager: React.FormEventHandler<HTMLFormElement>;
}

export function ProjectDetail({
  data,
  canManageMembers,
  availableMembers,
  addMemberControl,
  addMemberError,
  addMemberLoading,
  onAddMember,
  isAdmin,
  managers,
  reassignManagerControl,
  managerError,
  managerLoading,
  onReassignManager,
}: ProjectDetailProps) {
  const { project, manager, members, hoursLogged, percentage, status } = data;
  const style = STATUS_STYLES[status];
  const progressValue = percentage === null ? 0 : Math.min(percentage, 100);

  const selectedManagerId = useWatch({ control: reassignManagerControl, name: 'managerId' });
  const selectedMemberId = useWatch({ control: addMemberControl, name: 'memberId' });

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.clientName}</CardDescription>
          </div>
          {project.monthlyHourCap !== null && <Badge className={style.badgeClass}>{style.label}</Badge>}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {project.monthlyHourCap !== null ? (
            <div className="flex flex-col gap-2">
              <Progress value={progressValue} className={style.barClass} />
              <p className="text-sm text-muted-foreground">
                {hoursLogged}h / {project.monthlyHourCap}h this month ({percentage}%)
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {hoursLogged}h logged this month (no monthly cap set)
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Manager: {manager ? `${manager.name} (${manager.email})` : 'Unassigned'}
          </p>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Reassign manager</CardTitle>
            <CardDescription>Only admins can change who manages this project.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex items-end gap-2" onSubmit={onReassignManager} noValidate>
              <div className="flex flex-1 flex-col gap-2">
                <Controller
                  name="managerId"
                  control={reassignManagerControl}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(value) => field.onChange(value ?? '')}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a PM">
                          {(value: string | null) => {
                            const pm = managers.find((m) => String(m.id) === value);
                            return pm ? `${pm.name} (${pm.email})` : 'Select a PM';
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((pm) => (
                          <SelectItem key={pm.id} value={String(pm.id)}>
                            {pm.name} ({pm.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button type="submit" disabled={managerLoading || !selectedManagerId}>
                {managerLoading ? 'Reassigning...' : 'Reassign'}
              </Button>
            </form>
            {managerError && <p className="mt-2 text-sm text-destructive">{managerError}</p>}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members assigned yet.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {members.map((member) => (
                <li key={member.id} className="text-sm">
                  {member.name} <span className="text-muted-foreground">({member.email})</span>
                </li>
              ))}
            </ul>
          )}

          {canManageMembers && (
            <form className="flex items-end gap-2" onSubmit={onAddMember} noValidate>
              <div className="flex flex-1 flex-col gap-2">
                <Controller
                  name="memberId"
                  control={addMemberControl}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(value) => field.onChange(value ?? '')}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            availableMembers.length === 0
                              ? 'No members available to add'
                              : 'Select a member'
                          }
                        >
                          {(value: string | null) => {
                            const member = availableMembers.find((m) => String(m.id) === value);
                            if (member) return `${member.name} (${member.email})`;
                            return availableMembers.length === 0
                              ? 'No members available to add'
                              : 'Select a member';
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableMembers.map((member) => (
                          <SelectItem key={member.id} value={String(member.id)}>
                            {member.name} ({member.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button type="submit" disabled={addMemberLoading || !selectedMemberId}>
                {addMemberLoading ? 'Adding...' : 'Add'}
              </Button>
            </form>
          )}
          {addMemberError && <p className="text-sm text-destructive">{addMemberError}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
