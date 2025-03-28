import {
  Redirect,
  Slot,
  Stack,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import "@/global.css";
import { useAuth } from "@clerk/clerk-expo";

const Layout = () => {
  const { isSignedIn } = useAuth();
  const segments = useSegments();

  const inAuthGroup = segments[1] === "(authenticated)";

  // Protect the inside area
  if (!isSignedIn && inAuthGroup) {
    return <Redirect href="/" />;
  }

  return <Slot />;
};

export default Layout;
