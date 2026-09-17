import { exitCode, runOnce } from '@umbrella/scheduled-task';

export async function run(): Promise<0 | 1> {
  const result = await runOnce(async () => {
    process.stdout.write(
      `${JSON.stringify({ ts: new Date().toISOString(), level: 'info', message: 'scheduled task complete' })}\n`,
    );
  });
  return exitCode(result);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().then((code) => process.exit(code));
}
