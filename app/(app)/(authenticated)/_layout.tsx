import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import { useAuth } from "@clerk/clerk-expo";
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

  return (
    <NoteProvider>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            title: "Voice Notes",
            headerRight: () => (
              <TouchableOpacity onPress={() => signOut()} className="p-2 mr-4">
                <Text className="text-blue-500">Log out</Text>
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
        <Stack.Screen
          name="[id]"
          options={{
            title: "Note",
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
  );
};

export default Layout;
