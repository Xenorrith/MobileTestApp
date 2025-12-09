import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { BrowseHeader } from "@/components/browse/BrowseHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { TaskCard } from "@/components/common/TaskCard";
import { useCategories } from "@/hooks/useCategories";
import { useTasks } from "@/hooks/useTasks";

const BrowseTasks: React.FC = () => {
  const { categories } = useCategories();
  const params = useLocalSearchParams<{ categoryId?: string }>();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<"date" | "price" | "title">("date");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const { tasks, loading, error } = useTasks(searchQuery, selectedCategoryIds, sortOption);

  useEffect(() => {
    if (params.categoryId) {
      const id = Number(params.categoryId);
      if (!Number.isNaN(id)) {
        setSelectedCategoryIds([id]);
        setFiltersExpanded(true);
      }
    }
  }, [params.categoryId]);

  const toggleCategory = (id: number) => {
    if (id === -1) {
      setSelectedCategoryIds([]);
      return;
    }
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    setSortOption("date");
    setSearchQuery("");
  };

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!tasks.length) {
      return (
        <EmptyState
          title="No tasks yet"
          subtitle="New tasks will appear here once they are created."
        />
      );
    }

    return (
      <View style={styles.listContainer}>
        {tasks.map((task) => (
          <Link key={task.id} href={`/task/${task.id}`} asChild>
            <TaskCard task={task} onPress={() => { }} />
          </Link>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BrowseHeader
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        filtersExpanded={filtersExpanded}
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        sortOption={sortOption}
        onToggleSearch={() => setSearchOpen((prev) => !prev)}
        onSearchChange={setSearchQuery}
        onSearchClose={() => setSearchQuery("")}
        onToggleFilters={() => setFiltersExpanded((prev) => !prev)}
        onToggleCategory={toggleCategory}
        onSortChange={setSortOption}
        onReset={handleReset}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default BrowseTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5F9",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  listContainer: {
    gap: 12,
    paddingTop: 16,
  },
});
