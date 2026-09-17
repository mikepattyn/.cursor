export type Config = {
  port: number;
  brokerUrl: string;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const port = Number(env.PORT ?? 8082);
  const brokerUrl = env.BROKER_URL ?? 'nats://localhost:4222';
  const maxRetries = Number(env.MAX_RETRIES ?? 5);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer between 1 and 65535, got ${env.PORT}`);
  }
  try {
    new URL(brokerUrl);
  } catch {
    throw new Error(`BROKER_URL must be an absolute URL, got ${brokerUrl}`);
  }
  if (!Number.isInteger(maxRetries) || maxRetries < 0) {
    throw new Error(`MAX_RETRIES must be a non-negative integer, got ${env.MAX_RETRIES}`);
  }

  return { port, brokerUrl, maxRetries };
}
