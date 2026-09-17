export type Config = {
  port: number;
  sqlitePath: string;
  logLevel: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const port = Number(env.PORT ?? 8081);
  const sqlitePath = env.SQLITE_PATH ?? '/data/calculator.db';

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer between 1 and 65535, got ${env.PORT}`);
  }
  if (sqlitePath.length === 0) {
    throw new Error('SQLITE_PATH must be a non-empty path');
  }

  return {
    port,
    sqlitePath,
    logLevel: env.LOG_LEVEL ?? 'info',
  };
}
