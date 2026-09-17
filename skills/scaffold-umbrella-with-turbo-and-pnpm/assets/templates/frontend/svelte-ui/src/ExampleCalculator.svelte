<script lang="ts">
  import { onMount } from 'svelte';
  import { Calculator } from '@umbrella/example-calculator';
  import { createCalculatorClient } from '@umbrella/calculator-client';

  const calculator = new Calculator();
  const client = createCalculatorClient({ baseUrl: '/api' });

  let left = $state(0);
  let right = $state(0);
  let result = $state<number | null>(null);
  let error = $state<string | null>(null);
  let status = $state<'idle' | 'loading' | 'saved' | 'offline'>('loading');

  onMount(async () => {
    const stored = await client.loadStoredValue();
    if (stored !== null) {
      result = stored;
    }
    status = 'idle';
  });

  function run(operation: 'add' | 'subtract' | 'multiply' | 'divide') {
    error = null;
    try {
      const next = calculator[operation](Number(left), Number(right));
      result = next;
      void client.persistValue(next).then((ok) => {
        status = ok ? 'saved' : 'offline';
      });
    } catch (err) {
      result = null;
      error = err instanceof Error ? err.message : 'Calculation failed';
    }
  }
</script>

<form onsubmit={(event) => event.preventDefault()} aria-busy={status === 'loading'}>
  <label>
    Left
    <input type="number" name="left" bind:value={left} />
  </label>
  <label>
    Right
    <input type="number" name="right" bind:value={right} />
  </label>
  <div>
    <button type="button" onclick={() => run('add')}>Add</button>
    <button type="button" onclick={() => run('subtract')}>Subtract</button>
    <button type="button" onclick={() => run('multiply')}>Multiply</button>
    <button type="button" onclick={() => run('divide')}>Divide</button>
  </div>
  {#if status === 'loading'}
    <p>Loading saved value…</p>
  {/if}
  {#if status === 'saved'}
    <p role="status">Saved</p>
  {/if}
  {#if status === 'offline'}
    <p role="status">Result shown locally; persist is offline</p>
  {/if}
  {#if result !== null}
    <p>Result: {result}</p>
  {/if}
  {#if error}
    <p role="alert">{error}</p>
  {/if}
</form>
