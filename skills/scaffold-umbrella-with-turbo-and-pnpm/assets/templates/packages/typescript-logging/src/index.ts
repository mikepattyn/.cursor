export type LogFields = Record<string, unknown>;

export type Logger = {
  info(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
};

export function createLogger(level = 'info', write: (line: string) => void = (line) => process.stdout.write(line)): Logger {
  const emit = (severity: string, message: string, fields: LogFields = {}) => {
    write(`${JSON.stringify({ ts: new Date().toISOString(), level: severity, message, ...fields })}\n`);
  };
  return {
    info(message, fields) {
      if (level !== 'silent') {
        emit('info', message, fields);
      }
    },
    error(message, fields) {
      emit('error', message, fields);
    },
  };
}
