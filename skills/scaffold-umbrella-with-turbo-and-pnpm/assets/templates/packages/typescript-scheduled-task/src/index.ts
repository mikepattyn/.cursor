export type TaskResult = { ok: true } | { ok: false; error: string };

export async function runOnce(task: () => Promise<void> | void): Promise<TaskResult> {
  try {
    await task();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export function exitCode(result: TaskResult): 0 | 1 {
  return result.ok ? 0 : 1;
}
