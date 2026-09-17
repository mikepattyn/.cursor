<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Calculator } from '@umbrella/example-calculator';
import { createCalculatorClient } from '@umbrella/calculator-client';

const calculator = new Calculator();
const client = createCalculatorClient({ baseUrl: '/api' });

const left = ref(0);
const right = ref(0);
const result = ref<number | null>(null);
const error = ref<string | null>(null);
const status = ref<'idle' | 'loading' | 'saved' | 'offline'>('loading');

onMounted(async () => {
  const stored = await client.loadStoredValue();
  if (stored !== null) {
    result.value = stored;
  }
  status.value = 'idle';
});

function run(operation: 'add' | 'subtract' | 'multiply' | 'divide') {
  error.value = null;
  try {
    const next = calculator[operation](Number(left.value), Number(right.value));
    result.value = next;
    void client.persistValue(next).then((ok) => {
      status.value = ok ? 'saved' : 'offline';
    });
  } catch (err) {
    result.value = null;
    error.value = err instanceof Error ? err.message : 'Calculation failed';
  }
}
</script>

<template>
  <form @submit.prevent :aria-busy="status === 'loading'">
    <label>
      Left
      <input v-model.number="left" type="number" name="left" />
    </label>
    <label>
      Right
      <input v-model.number="right" type="number" name="right" />
    </label>
    <div>
      <button type="button" @click="run('add')">Add</button>
      <button type="button" @click="run('subtract')">Subtract</button>
      <button type="button" @click="run('multiply')">Multiply</button>
      <button type="button" @click="run('divide')">Divide</button>
    </div>
    <p v-if="status === 'loading'">Loading saved value…</p>
    <p v-if="status === 'saved'" role="status">Saved</p>
    <p v-if="status === 'offline'" role="status">Result shown locally; persist is offline</p>
    <p v-if="result !== null">Result: {{ result }}</p>
    <p v-if="error" role="alert">{{ error }}</p>
  </form>
</template>
