export type LogFields = Record<string, unknown>;

export type Logger = {
  info(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
};

export function createLogger(level = 'info'): Logger {
  const write = (severity: string, message: string, fields: LogFields = {}) => {
    process.stdout.write(
      `${JSON.stringify({ ts: new Date().toISOString(), level: severity, message, ...fields })}\n`,
    );
  };
  return {
    info(message, fields) {
      if (level !== 'silent') {
        write('info', message, fields);
      }
    },
    error(message, fields) {
      write('error', message, fields);
    },
  };
}
