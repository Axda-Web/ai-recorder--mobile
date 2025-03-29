import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import migrations from "@/drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useAuth } from "@clerk/clerk-expo";
import { Suspense } from "react";
import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import { NoteProvider } from "@/providers/NoteProvider";

cssInterop(Ionicons, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});

const Layout = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const expoDb = openDatabaseSync("notes.db");
  const db = drizzle(expoDb);

  const { success, error } = useMigrations(db, migrations);

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName="notes.db"
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <NoteProvider>
          <Stack>
            <Stack.Screen
              name="home"
              options={{
                title: "Voice Notes",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => signOut()} className="p-2">
                    <Ionicons
                      name="log-out-outline"
                      size={24}
                      className="color-blue-500"
                    />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="new-recording"
              options={{
                title: "New Recording",
                presentation: "modal",
                headerLeft: () => (
                  <Ionicons
                    name="close"
                    size={24}
                    onPress={() => router.back()}
                    className="color-blue-500"
                  />
                ),
              }}
            />
          </Stack>
        </NoteProvider>
      </SQLiteProvider>
    </Suspense>
  );
};

export default Layout;
