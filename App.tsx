import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider, useStore } from "./src/config/StoreContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

function AppStatusBar() {
  const { store } = useStore();
  return <StatusBar style={store.statusBar} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <AppStatusBar />
        <RootNavigator />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
