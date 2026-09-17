import { useEffect, useState, type FormEvent } from 'react';
import { Calculator } from '@umbrella/example-calculator';
import { createCalculatorClient } from '@umbrella/calculator-client';

const calculator = new Calculator();
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const client = createCalculatorClient({
  baseUrl: env?.VITE_API_BASE_URL || env?.API_BASE_URL || '/api',
});

export function ExampleCalculator() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'offline'>('loading');

  useEffect(() => {
    void client.loadStoredValue().then((stored) => {
      if (stored !== null) {
        setResult(stored);
      }
      setStatus('idle');
    });
  }, []);

  function run(operation: 'add' | 'subtract' | 'multiply' | 'divide') {
    setError(null);
    try {
      const next = calculator[operation](Number(left), Number(right));
      setResult(next);
      void client.persistValue(next).then((ok) => {
        setStatus(ok ? 'saved' : 'offline');
      });
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <form onSubmit={onSubmit} aria-busy={status === 'loading'}>
      <label>
        Left
        <input
          type="number"
          name="left"
          value={left}
          onChange={(event) => setLeft(Number(event.target.value))}
        />
      </label>
      <label>
        Right
        <input
          type="number"
          name="right"
          value={right}
          onChange={(event) => setRight(Number(event.target.value))}
        />
      </label>
      <div>
        <button type="button" onClick={() => run('add')}>
          Add
        </button>
        <button type="button" onClick={() => run('subtract')}>
          Subtract
        </button>
        <button type="button" onClick={() => run('multiply')}>
          Multiply
        </button>
        <button type="button" onClick={() => run('divide')}>
          Divide
        </button>
      </div>
      {status === 'loading' ? <p>Loading saved value…</p> : null}
      {status === 'saved' ? <p role="status">Saved</p> : null}
      {status === 'offline' ? <p role="status">Result shown locally; persist is offline</p> : null}
      {result !== null ? <p>Result: {result}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
    </form>
  );
}
