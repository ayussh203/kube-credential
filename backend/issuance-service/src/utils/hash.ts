import { createHash } from 'crypto';

/** Recursively sort object keys so JSON is stable before hashing */
function stable(obj: any): any {
  if (Array.isArray(obj)) return obj.map(stable);
  if (obj && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc: Record<string, any>, k) => {
        acc[k] = stable(obj[k]);
        return acc;
      }, {});
  }
  return obj;
}

export function sha256Stable(input: unknown): string {
  const json = JSON.stringify(stable(input));
  return createHash('sha256').update(json).digest('hex');
}
