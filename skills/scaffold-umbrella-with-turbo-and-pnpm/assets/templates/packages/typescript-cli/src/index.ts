export type FlagMap = Record<string, string | boolean>;

export type ParsedArgv = {
  command: string;
  args: string[];
  flags: FlagMap;
};

export function parseArgv(argv: string[]): ParsedArgv {
  const tokens = argv.slice(2);
  const flags: FlagMap = {};
  const rest: string[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.startsWith('--')) {
      const [name, inline] = token.slice(2).split('=', 2);
      if (inline !== undefined) {
        flags[name] = inline;
        continue;
      }
      const next = tokens[i + 1];
      if (next && !next.startsWith('-')) {
        flags[name] = next;
        i += 1;
      } else {
        flags[name] = true;
      }
      continue;
    }
    rest.push(token);
  }
  return { command: rest[0] ?? 'help', args: rest.slice(1), flags };
}

export async function runCommand(
  parsed: ParsedArgv,
  handlers: Record<string, (parsed: ParsedArgv) => Promise<number> | number>,
): Promise<number> {
  const handler = handlers[parsed.command] ?? handlers.help;
  if (!handler) {
    return 1;
  }
  return handler(parsed);
}
