import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CapStatus, ProjectSummary } from '@/lib/projects-api';
import { cn } from '@/lib/utils';

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

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const { id, name, clientName, monthlyHourCap, hoursLogged, percentage, status } = project;
  const style = STATUS_STYLES[status];
  const progressValue = percentage === null ? 0 : Math.min(percentage, 100);

  return (
    <Link href={`/projects/${id}`}>
      <Card className={cn('h-full transition-colors hover:bg-accent/50', status === 'over' && 'border-red-400 dark:border-red-800')}>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{clientName}</CardDescription>
          </div>
          {monthlyHourCap !== null && <Badge className={style.badgeClass}>{style.label}</Badge>}
        </CardHeader>
        <CardContent>
          {monthlyHourCap !== null ? (
            <div className="flex flex-col gap-2">
              <Progress value={progressValue} className={style.barClass} />
              <p className="text-sm text-muted-foreground">
                {hoursLogged}h / {monthlyHourCap}h this month ({percentage}%)
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {hoursLogged}h logged this month (no monthly cap set)
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
