import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Calculator } from '@umbrella/example-calculator';
import { createCalculatorClient } from '@umbrella/calculator-client';

const calculator = new Calculator();
const client = createCalculatorClient({
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || '/api',
});

export function CalculatorScreen() {
  const [left, setLeft] = useState('0');
  const [right, setRight] = useState('0');
  const [result, setResult] = useState<number | null>(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    void client.loadStoredValue().then((stored) => {
      if (stored !== null) {
        setResult(stored);
      }
      setStatus('idle');
    });
  }, []);

  function run(op: 'add' | 'subtract' | 'multiply' | 'divide') {
    const next = calculator[op](Number(left), Number(right));
    setResult(next);
    void client.persistValue(next).then((ok) => setStatus(ok ? 'saved' : 'offline'));
  }

  return (
    <View>
      <Text>Calculator</Text>
      <TextInput value={left} onChangeText={setLeft} keyboardType="numeric" />
      <TextInput value={right} onChangeText={setRight} keyboardType="numeric" />
      <Pressable onPress={() => run('add')}>
        <Text>Add</Text>
      </Pressable>
      {result !== null ? <Text>Result: {result}</Text> : null}
      <Text>{status}</Text>
    </View>
  );
}
