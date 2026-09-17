export type Config = {
  port: number;
  calculatorUrl: string;
  upstreamTimeoutMs: number;
  logLevel: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const calculatorUrl = (env.CALCULATOR_URL ?? 'http://localhost:8081').replace(/\/$/, '');
  const port = Number(env.PORT ?? 3000);
  const upstreamTimeoutMs = Number(env.UPSTREAM_TIMEOUT_MS ?? 5000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer between 1 and 65535, got ${env.PORT}`);
  }
  if (!Number.isFinite(upstreamTimeoutMs) || upstreamTimeoutMs < 1) {
    throw new Error(`UPSTREAM_TIMEOUT_MS must be a positive number, got ${env.UPSTREAM_TIMEOUT_MS}`);
  }
  try {
    new URL(calculatorUrl);
  } catch {
    throw new Error(`CALCULATOR_URL must be an absolute URL, got ${calculatorUrl}`);
  }

  return {
    port,
    calculatorUrl,
    upstreamTimeoutMs,
    logLevel: env.LOG_LEVEL ?? 'info',
  };
}
