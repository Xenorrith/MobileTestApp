import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClose }) => {
  return (
    <View style={styles.searchBar}>
      <MaterialIcons name="search" size={18} color="#6C7A89" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks"
        placeholderTextColor="#6C7A89"
        value={value}
        onChangeText={onChangeText}
        autoFocus
      />
      {value ? (
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={18} color="#6C7A89" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    backgroundColor: "#001D2A",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: "#EFFFF7",
  },
});

