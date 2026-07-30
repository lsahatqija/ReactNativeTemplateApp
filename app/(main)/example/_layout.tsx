import { Stack } from 'expo-router';

/** Nested stack so list → details navigation works within the "Notes" tab. */
export default function ExampleLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Notes' }} />
      <Stack.Screen name="[id]" options={{ title: 'Note' }} />
    </Stack>
  );
}
