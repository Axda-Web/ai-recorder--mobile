import { View, Text, TouchableOpacity } from "react-native";
import { Note } from "@/db/schema";
import { Ionicons } from "@expo/vector-icons";
import { useNotes } from "@/providers/NoteProvider";
import { useAudioPlayer } from "expo-audio";
import { Link } from "expo-router";
interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const { deleteNote } = useNotes();
  const player = useAudioPlayer(note.note_audio_url);
  const formattedDate = new Date(note.created_at).toLocaleDateString();

  const playAudio = async () => {
    await player.seekTo(0);
    await player.play();
  };

  return (
    <Link href={`/${note.id}`} asChild>
      <View className="bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              {note.title}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {formattedDate}
            </Text>
            <Text
              numberOfLines={3}
              className="text-gray-600 dark:text-gray-300"
            >
              {note.note_text}
            </Text>
          </View>
          <TouchableOpacity onPress={() => deleteNote(note.id)} className="p-2">
            <Ionicons
              name="trash-outline"
              size={20}
              className="color-red-500"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playAudio} className="p-2">
            <Ionicons
              name="play-outline"
              size={20}
              className="color-blue-500"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Link>
  );
}
