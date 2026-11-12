import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StudioProvider } from "../store";
export default function Layout() {
  return (
    <SafeAreaProvider>
      <StudioProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F8F6F3" },
          }}
        />
      </StudioProvider>
    </SafeAreaProvider>
  );
}
