import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { useNotes } from "@/providers/NoteProvider";

const Page = () => {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const [transcription, setTranscription] = useState("");
  const [title, setTitle] = useState(
    `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { saveNote } = useNotes();

  // Effect to trigger transcription when the component mounts or URI changes
  useEffect(() => {
    handleTranscribe();
  }, [uri]);

  const handleTranscribe = async () => {
    if (!uri) return;

    setIsLoading(true);
    try {
      if (Platform.OS === "web") {
        // Fetch the blob from the URI
        const response = await fetch(uri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", blob, "audio.m4a");

        const apiResponse = await fetch(
          "http://localhost:8081/api/speech-to-text",
          {
            method: "POST",
            body: formData,
          }
        ).then((response) => response.json());

        setTranscription(apiResponse.text || "No transcription available");
      } else {
        let formData;
        const audioData = {
          uri,
          type: "audio/m4a",
          name: "audio.m4a",
        };
        formData = new FormData();
        formData.append("file", audioData as unknown as Blob);

        const uploadResult = await FileSystem.uploadAsync(
          "http://localhost:8081/api/speech-to-text",
          uri,
          {
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "file",
            mimeType: "audio/m4a",
          }
        );
        const transcription = JSON.parse(uploadResult.body).text;
        setTranscription(transcription || "No transcription available");
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const note = {
      id: new Date().toISOString(),
      title,
      note_text: transcription,
      note_audio_url: uri || "",
      created_at: new Date().toISOString(),
    };

    await saveNote(note);

    router.dismissAll();
  };

  return (
    <View className="p-4 min-h-full">
      <TextInput
        className="p-4 mb-4 text-base border border-gray-300 rounded-lg bg-white"
        multiline
        textAlignVertical="top"
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        editable={!isLoading}
      />
      <TextInput
        className="p-4 mb-4 text-base border border-gray-300 rounded-lg bg-white h-[200px]"
        multiline
        value={transcription}
        onChangeText={setTranscription}
        placeholder="Transcription will appear here..."
        editable={!isLoading}
      />
      <TouchableOpacity
        className={`p-4 rounded-lg bg-blue-500 ${
          isLoading ? "opacity-50" : ""
        }`}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text className="text-center text-white font-medium">
          Save Transcription
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default Page;
