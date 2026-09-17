import { parseArgv, runCommand } from '@umbrella/cli';
import { Calculator } from '@umbrella/example-calculator';

const calculator = new Calculator();

export async function main(argv: string[] = process.argv): Promise<number> {
  return runCommand(parseArgv(argv), {
    add: ({ args }) => print(calculator.add(num(args[0]), num(args[1]))),
    subtract: ({ args }) => print(calculator.subtract(num(args[0]), num(args[1]))),
    multiply: ({ args }) => print(calculator.multiply(num(args[0]), num(args[1]))),
    divide: ({ args }) => print(calculator.divide(num(args[0]), num(args[1]))),
    help: () => {
      process.stdout.write('usage: examplectl <add|subtract|multiply|divide> <left> <right>\n');
      return 0;
    },
  });
}

function num(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`expected a number, got ${value}`);
  }
  return parsed;
}

function print(value: number): number {
  process.stdout.write(`${value}\n`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((code) => process.exit(code), (error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  });
}
