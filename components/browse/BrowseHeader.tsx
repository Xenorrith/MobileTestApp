import type { Category } from "@/types/category";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FilterPanel } from "./FilterPanel";
import { SearchBar } from "./SearchBar";

interface BrowseHeaderProps {
  searchOpen: boolean;
  searchQuery: string;
  filtersExpanded: boolean;
  categories: Category[];
  selectedCategoryIds: number[];
  sortOption: "date" | "price" | "title";
  onToggleSearch: () => void;
  onSearchChange: (value: string) => void;
  onSearchClose: () => void;
  onToggleFilters: () => void;
  onToggleCategory: (id: number) => void;
  onSortChange: (option: "date" | "price" | "title") => void;
  onReset: () => void;
};

export const BrowseHeader: React.FC<BrowseHeaderProps> = ({
  searchOpen,
  searchQuery,
  filtersExpanded,
  categories,
  selectedCategoryIds,
  sortOption,
  onToggleSearch,
  onSearchChange,
  onSearchClose,
  onToggleFilters,
  onToggleCategory,
  onSortChange,
  onReset,
}) => {
  return (
    <View style={styles.headerContainer}>
      {searchOpen ? (
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          onClose={onToggleSearch}
        />
      ) : (
        <>
          <View style={styles.headerTopRow}>
            <Text style={styles.pageTitle}>Browse Tasks</Text>
            <View style={styles.headerIconsRow}>
              <TouchableOpacity onPress={onToggleSearch}>
                <MaterialIcons name="search" size={20} color="#50FFA1" />
              </TouchableOpacity>
              <MaterialIcons name="notifications-none" size={20} color="#50FFA1" />
            </View>
          </View>

          <View style={styles.toolbarRow}>
            <TouchableOpacity
              style={[styles.filterButton, filtersExpanded && styles.filterButtonActive]}
              onPress={onToggleFilters}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filtersExpanded && styles.filterButtonTextActive,
                ]}
              >
                Filter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortStatus}
              onPress={() =>
                onSortChange(sortOption === "date" ? "price" : sortOption === "price" ? "title" : "date")
              }
            >
              <Text style={styles.sortText}>Sort ↓ {sortOption}</Text>
              <MaterialIcons name="autorenew" size={18} color="#50FFA1" />
            </TouchableOpacity>
          </View>

          {filtersExpanded && (
            <FilterPanel
              categories={categories}
              selectedCategories={selectedCategoryIds}
              sortOption={sortOption}
              onCategorySelect={onToggleCategory}
              onSortChange={onSortChange}
              onReset={onReset}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#012333",
    borderBottomWidth: 1,
    borderBottomColor: "#081F2C",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIconsRow: {
    flexDirection: "row",
    columnGap: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#EFFFF7",
  },
  toolbarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  filterButton: {
    borderColor: "#50FFA1",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  filterButtonActive: {
    backgroundColor: "#50FFA1",
  },
  filterButtonText: {
    color: "#50FFA1",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#012333",
  },
  sortStatus: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  sortText: {
    color: "#EFFFF7",
  },
});

