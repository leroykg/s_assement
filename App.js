import { ExpoRoot } from "expo-router";
import { useFonts, NotoSans_400Regular, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';

export default function App() {
  
  let [fontsLoaded] = useFonts({
     NotoSans_400Regular, NotoSans_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }


  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} location="/" />;
}