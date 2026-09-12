import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CapStatus, ProjectDetail as ProjectDetailData } from '@/lib/projects-api';

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

export interface ProjectDetailProps {
  data: ProjectDetailData;
  canManageMembers: boolean;
  newMemberUserId: string;
  addMemberError: string | null;
  addMemberLoading: boolean;
  onNewMemberUserIdChange: (value: string) => void;
  onAddMember: (e: React.FormEvent) => void;
}

export function ProjectDetail({
  data,
  canManageMembers,
  newMemberUserId,
  addMemberError,
  addMemberLoading,
  onNewMemberUserIdChange,
  onAddMember,
}: ProjectDetailProps) {
  const { project, members, hoursLogged, percentage, status } = data;
  const style = STATUS_STYLES[status];
  const progressValue = percentage === null ? 0 : Math.min(percentage, 100);

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
        <CardContent>
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
        </CardContent>
      </Card>

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
            <form className="flex items-end gap-2" onSubmit={onAddMember}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="newMemberUserId">Add member by user ID</Label>
                <Input
                  id="newMemberUserId"
                  type="number"
                  value={newMemberUserId}
                  onChange={(e) => onNewMemberUserIdChange(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={addMemberLoading}>
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
