import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserSummary } from '@/lib/users-api';

export interface CreateProjectProps {
  name: string;
  clientName: string;
  monthlyHourCap: string;
  members: UserSummary[];
  membersLoading: boolean;
  selectedMemberIds: number[];
  error: string | null;
  loading: boolean;
  onNameChange: (value: string) => void;
  onClientNameChange: (value: string) => void;
  onMonthlyHourCapChange: (value: string) => void;
  onToggleMember: (id: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateProject({
  name,
  clientName,
  monthlyHourCap,
  members,
  membersLoading,
  selectedMemberIds,
  error,
  loading,
  onNameChange,
  onClientNameChange,
  onMonthlyHourCapChange,
  onToggleMember,
  onSubmit,
}: CreateProjectProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>Set up a project, its monthly hour cap, and who&apos;s on it.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="clientName">Client name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="monthlyHourCap">Monthly hour cap</Label>
            <Input
              id="monthlyHourCap"
              type="number"
              min={1}
              placeholder="e.g. 160"
              value={monthlyHourCap}
              onChange={(e) => onMonthlyHourCapChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Members</Label>
            {membersLoading ? (
              <p className="text-sm text-muted-foreground">Loading members...</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members available to assign yet.</p>
            ) : (
              <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border p-2">
                {members.map((member) => {
                  const checked = selectedMemberIds.includes(member.id);
                  return (
                    <label
                      key={member.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onToggleMember(member.id)}
                      />
                      <span className="flex-1">{member.name}</span>
                      <span className="text-muted-foreground">{member.email}</span>
                    </label>
                  );
                })}
              </div>
            )}
            {selectedMemberIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedMemberIds.length} member{selectedMemberIds.length === 1 ? '' : 's'} selected
              </p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
