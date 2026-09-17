export type StatusTone = 'idle' | 'saved' | 'offline' | 'error';

export function Status({ tone, children }: { tone: StatusTone; children: string }) {
  if (tone === 'idle') {
    return null;
  }
  const role = tone === 'error' ? 'alert' : 'status';
  return <p role={role}>{children}</p>;
}
