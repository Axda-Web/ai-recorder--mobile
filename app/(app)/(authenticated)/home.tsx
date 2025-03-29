import { useEffect, useState } from "react";
import { View, Text, Alert, TouchableOpacity, FlatList } from "react-native";
import {
  RecordingPresets,
  RecorderState,
  useAudioRecorder,
  AudioModule,
} from "expo-audio";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNotes } from "@/providers/NoteProvider";
// import { NoteCard } from "@/components/NoteCard";
import Animated, { LinearTransition } from "react-native-reanimated";

const Page = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();
  //   const { notes } = useNotes();

  async function startRecording() {
    try {
      const permissionResponse =
        await AudioModule.requestRecordingPermissionsAsync();
      console.log(
        "🚀 ~ startRecording ~ permissionResponse:",
        permissionResponse
      );
      if (permissionResponse.status === "granted") {
        console.log("Permission granted");
      } else {
        Alert.alert("Permission not granted");
      }
      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (!audioRecorder.isRecording) return;
    setIsRecording(false);
    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    if (!uri) {
      console.error("Failed to get URI for recording");
      return;
    }
    // router.push(`/new-recording?uri=${encodeURIComponent(uri)}`);
  }

  return (
    <View className="flex-1">
      {/* <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={notes}
        renderItem={({ item }) => <NoteCard note={item} />}
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-500">No notes yet</Text>
        )}
        contentContainerClassName="p-4"
      /> */}

      <View className="flex-1 justify-center items-center absolute bottom-10 self-center w-full">
        <TouchableOpacity
          //   onPress={audioRecorder.isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-[50%] ${
            isRecording ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          <Ionicons name="mic" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Page;
