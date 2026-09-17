import { Pressable, Text, View } from 'react-native';

export function AuthScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <View>
      <Text>Sign in</Text>
      <Text>Local preview only. Wire OIDC in the host app; do not embed secrets here.</Text>
      <Pressable onPress={onContinue}>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
}
