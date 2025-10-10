export function getWorkerId(): string {
  const host = process.env.HOSTNAME || 'local';
  const suffix = host.split('-').pop() || host.slice(-4);
  return `worker-${suffix}`;
}
