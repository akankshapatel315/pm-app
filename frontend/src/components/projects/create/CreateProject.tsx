import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface CreateProjectProps {
  name: string;
  clientName: string;
  monthlyHourCap: string;
  error: string | null;
  loading: boolean;
  onNameChange: (value: string) => void;
  onClientNameChange: (value: string) => void;
  onMonthlyHourCapChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateProject({
  name,
  clientName,
  monthlyHourCap,
  error,
  loading,
  onNameChange,
  onClientNameChange,
  onMonthlyHourCapChange,
  onSubmit,
}: CreateProjectProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>Set up a project and its monthly hour cap.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
