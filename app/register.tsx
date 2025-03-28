import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSignUp } from "@clerk/clerk-expo";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "simon@galaxies.dev",
      password: "Test12345",
      // name: "Simon",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        // firstName: data.name,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        if (Platform.OS === "web") {
          alert("Failed to sign in");
        } else {
          Alert.alert("Error", "Failed to sign in");
        }
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (Platform.OS === "web") {
        alert("Failed to sign in");
      } else {
        Alert.alert("Error", "Failed to sign in");
      }
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white px-4 justify-center items-center">
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View className="w-full max-w-md">
          <Text className="text-3xl font-bold mb-8 text-center text-gray-800">
            Create Account
          </Text>

          <View className="space-y-4 gap-2">
            <View>
              <Text className="text-gray-700 mb-2">Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Enter name"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500">{errors.name.message}</Text>
              )}
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Enter email"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500">{errors.email.message}</Text>
              )}
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Enter password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
            </View>

            <Pressable
              className="w-full bg-blue-600 py-4 rounded-lg hover:bg-blue-700 duration-300"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white text-center font-semibold">
                Register
              </Text>
            </Pressable>

            <Link href="/" asChild>
              <TouchableOpacity className="mt-4">
                <Text className="text-blue-500 text-center">
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      )}
    </View>
  );
}
