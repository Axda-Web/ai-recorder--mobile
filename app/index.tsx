import {
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import { useOAuth, useSignIn } from "@clerk/clerk-expo";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function Index() {
  const [loading, setLoading] = useState(false);
  // const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  // const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  // const { signIn, setActive, isLoaded } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "simon@galaxies.dev",
      password: "Test12345",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    // if (!isLoaded) return;

    setLoading(true);
    try {
      // const signInAttempt = await signIn.create({
      //   identifier: data.email,
      //   password: data.password,
      // });
      // console.log("signInAttempt", signInAttempt);
      // if (signInAttempt.status === "complete") {
      //   await setActive({ session: signInAttempt.createdSessionId });
      // } else {
      //   if (Platform.OS === "web") {
      //     alert("Failed to sign in");
      //   } else {
      //     Alert.alert("Error", "Failed to sign in");
      //   }
      // }
    } catch (err) {
      if (Platform.OS === "web") {
        alert("Failed to sign in");
      } else {
        Alert.alert("Error", "Failed to sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithApple = async () => {
    console.log("Sign in with Apple");

    try {
      // const { createdSessionId, setActive } = await appleAuth();
      // if (createdSessionId) {
      //   setActive!({ session: createdSessionId });
      // }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  const handleSignInWithGoogle = async () => {
    console.log("Sign in with Google");
    try {
      // const { createdSessionId, setActive } = await googleAuth();
      // if (createdSessionId) {
      //   setActive!({ session: createdSessionId });
      // }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 justify-center items-center">
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View className="w-full max-w-md">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Galaxies
            </Text>
            <Text className="text-gray-600">Sign in to continue</Text>
          </View>

          <View className="space-y-4 w-full gap-2">
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            <Pressable
              className="w-full bg-blue-600 py-4 rounded-lg hover:bg-blue-700 duration-300"
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold">
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </Pressable>

            <Link href="/register" asChild>
              <Pressable className="w-full">
                <Text className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <Text className="text-blue-600 font-semibold">
                    Create one
                  </Text>
                </Text>
              </Pressable>
            </Link>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500">or</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <Pressable
              className="w-full flex-row justify-center items-center bg-black py-3 rounded-lg hover:cursor-pointer hover:bg-gray-800 duration-300"
              onPress={handleSignInWithApple}
            >
              <Ionicons
                name="logo-apple"
                size={24}
                color="white"
                className="mr-2"
              />
              <Text className="text-white text-center font-semibold ml-2">
                Sign in with Apple
              </Text>
            </Pressable>

            <Pressable
              className="w-full flex-row justify-center items-center bg-black py-3 rounded-lg hover:cursor-pointer hover:bg-gray-800 duration-300"
              onPress={handleSignInWithGoogle}
            >
              <Ionicons
                name="logo-google"
                size={24}
                color="white"
                className="mr-2"
              />
              <Text className="text-white text-center font-semibold ml-2">
                Sign in with Google
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
