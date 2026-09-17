import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AuthScreen } from '../screens/AuthScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';

export function Shell() {
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return <AuthScreen onContinue={() => setAuthed(true)} />;
  }

  return (
    <View>
      <CalculatorScreen />
      <Pressable onPress={() => setAuthed(false)}>
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}
