export type CapStatus = 'ok' | 'warning' | 'over';

const WARNING_THRESHOLD_PERCENTAGE = 90;

export function computeCapStatus(
  hoursLogged: number,
  monthlyHourCap: number | null
): { percentage: number | null; status: CapStatus } {
  if (monthlyHourCap === null || monthlyHourCap <= 0) {
    return { percentage: null, status: 'ok' };
  }

  const percentage = Math.round((hoursLogged / monthlyHourCap) * 10000) / 100;

  let status: CapStatus = 'ok';
  if (percentage >= 100) {
    status = 'over';
  } else if (percentage >= WARNING_THRESHOLD_PERCENTAGE) {
    status = 'warning';
  }

  return { percentage, status };
}
