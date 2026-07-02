import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="reportar" options={{ title: "Nuevo Reporte (Alumnos)" }} />
      <Stack.Screen name="exito-reporte" options={{ title: "Éxito", headerShown: false }} />
      <Stack.Screen name="mantenimiento" options={{ title: "Panel de Mantenimiento (Admin)" }} />
    </Stack>
  );
}
