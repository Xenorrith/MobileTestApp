import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export const CreateTaskSection = () => {
  const [inputValue, setInputValue] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      router.push({
        pathname: "/add-tasks",
        params: { initialTitle: inputValue.trim() },
      });
      setInputValue("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need Help? Get it done.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="In a few words, what do you need done?"
          placeholderTextColor="#6C7A89"
          value={inputValue}
          onChangeText={setInputValue}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.button, (!inputValue.trim()) && styles.buttonDisabled]}
        onPress={handleSubmit}
        activeOpacity={0.9}
        disabled={!inputValue.trim()}
      >
        <>
          <Text style={styles.buttonText}>Get Something Done</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#012333" />
        </>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#012333",
    padding: 20,
    marginBottom: 32,
    gap: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#EFFFF7",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 110,
  },
  input: {
    fontSize: 16,
    color: "#012333",
    height: 110,
  },
  button: {
    backgroundColor: "#50FFA1",
    borderRadius: 200,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#012333",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

