import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useNotes } from "@/providers/NoteProvider";
import { useAudioPlayer } from "expo-audio";
import { TouchableOpacity } from "react-native";
import { useState } from "react";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes } = useNotes();
  const [isPlaying, setIsPlaying] = useState(false);

  const note = notes.find((note) => {
    return note.id === id;
  });
  const player = useAudioPlayer(note?.note_audio_url);

  const handlePlayPause = async () => {
    if (!note?.note_audio_url) return;
    await player.seekTo(0);
    await player.play();
  };

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-gray-600">Note not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      <Stack.Screen options={{ title: note.title ?? "Note" }} />
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">{note.title}</Text>
        <Text className="text-sm text-gray-500 mb-4">
          {new Date(note.created_at).toLocaleDateString()}
        </Text>

        {note.note_audio_url ? (
          <TouchableOpacity
            onPress={handlePlayPause}
            className="bg-blue-500 p-3 rounded-lg mb-4 w-32"
          >
            <Text className="text-white text-center">
              {isPlaying ? "Pause Audio" : "Play Audio"}
            </Text>
          </TouchableOpacity>
        ) : null}

        <Text className="text-base leading-relaxed">{note.note_text}</Text>
      </View>
    </ScrollView>
  );
}
