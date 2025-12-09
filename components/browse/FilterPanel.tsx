import type { Category } from "@/types/category";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FilterPanelProps {
  categories: Category[];
  selectedCategories: number[];
  sortOption: "date" | "price" | "title";
  onCategorySelect: (id: number) => void;
  onSortChange: (option: "date" | "price" | "title") => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategories,
  sortOption,
  onCategorySelect,
  onSortChange,
  onReset,
}) => {
  return (
    <View style={styles.filterPanel}>
      <Text style={styles.filterLabel}>Filter by Category</Text>
      <View style={styles.chipRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedCategories.length && styles.filterChipSelected,
          ]}
          onPress={() => onCategorySelect(-1)}
        >
          <Text
            style={[
              styles.filterChipText,
              !selectedCategories.length && styles.filterChipTextSelected,
            ]}
          >
            All Categories
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              onPress={() => onCategorySelect(cat.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextSelected,
                ]}
              >
                {cat.category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.filterLabel}>Sort by</Text>
      <View style={styles.sortRow}>
        <View style={styles.sortChipGroup}>
          {(["date", "price", "title"] as const).map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.sortChip, sortOption === option && styles.sortChipActive]}
              onPress={() => onSortChange(option)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortOption === option && styles.sortChipTextActive,
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterPanel: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#001C2A",
    gap: 12,
  },
  filterLabel: {
    color: "#EFFFF7",
    fontSize: 18,
    fontWeight: "700",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  sortChipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    flex: 1,
  },
  filterChip: {
    borderColor: "#26465A",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  filterChipSelected: {
    backgroundColor: "#50FFA1",
    borderColor: "#50FFA1",
  },
  filterChipText: {
    color: "#EFFFF7",
    textAlign: "center",
  },
  filterChipTextSelected: {
    color: "#012333",
    fontWeight: "700",
  },
  sortChip: {
    borderColor: "#26465A",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  sortChipActive: {
    backgroundColor: "#50FFA1",
    borderColor: "#50FFA1",
  },
  sortChipText: {
    color: "#EFFFF7",
    fontWeight: "600",
  },
  sortChipTextActive: {
    color: "#012333",
  },
  resetButton: {
    borderRadius: 999,
    backgroundColor: "#FF4C4C",
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

