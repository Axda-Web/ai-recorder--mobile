import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Note } from "@/db/schema";
import { useNotes } from "@/providers/NoteProvider";
import { useAudioPlayer } from "expo-audio";
import * as ContextMenu from "zeego/context-menu";
import { Link } from "expo-router";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const { deleteNote, updateNote } = useNotes();
  const player = useAudioPlayer(note.note_audio_url);
  const formattedDate = new Date(note.created_at).toLocaleDateString();

  const playAudio = async () => {
    console.log("playAudio", note.note_audio_url);
    await player.seekTo(0);
    await player.play();
  };

  const onRenamePhrase = (id: string, title: string) => {
    console.log("onRenamePhrase", id, title);
    Alert.prompt(
      "Rename Note",
      "Enter a new name for this note",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Rename",
          onPress: (newName) => {
            if (newName?.trim()) {
              updateNote(id, { ...note, title: newName.trim() });
            }
          },
        },
      ],
      "plain-text",
      note.title ?? ""
    );
  };

  const onDeleteNote = async (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteNote(id);
        },
      },
    ]);
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Link href={`/${note.id}`} asChild>
          <TouchableOpacity className="bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
            </View>
          </TouchableOpacity>
        </Link>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item
          key={`rename-${note.id}`}
          onSelect={() => onRenamePhrase(note.id, note.title ?? "")}
        >
          <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "pencil",
              pointSize: 18,
              scale: "medium",
            }}
          ></ContextMenu.ItemIcon>
        </ContextMenu.Item>

        <ContextMenu.Item key={`play-${note.id}`} onSelect={() => playAudio()}>
          <ContextMenu.ItemTitle>Play</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "play",
              pointSize: 18,
              scale: "medium",
            }}
          ></ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Item
          destructive
          key={`delete-${note.id}`}
          onSelect={() => onDeleteNote(note.id)}
        >
          <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "trash",
              pointSize: 18,
              scale: "medium",
            }}
          ></ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
