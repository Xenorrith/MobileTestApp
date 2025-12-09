import Header from "@/components/Header";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  return (
    <>
      <Header
        actions={[
          {
            label: "Home",
            onPress: () => router.replace("/"),
          },
        ]}
      />
      <View style={styles.mainScroll}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#012333" },
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
    backgroundColor: "#012333",
  },
});
