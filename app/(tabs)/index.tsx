import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { CategoryCard } from "@/components/home/CategoryCard";
import { CreateTaskSection } from "@/components/home/CreateTaskSection";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";


const Home: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { categories, loading, error } = useCategories();

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!categories.length) {
      return <EmptyState title="No categories yet" />;
    }

    return (
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.category}
            icon={category.icon}
            onPress={() => router.push(`/browse?category=${category.id}`)}
          />
        ))}
      </View>
    );
  };

  return (
    <>
      <ScrollView>
        {user?.profile?.role === "employeer" && (
          <CreateTaskSection />
        )}
        <View style={styles.mainContent}>
          <Text style={styles.mainTitle}>Need something done?</Text>
          <Text style={styles.mainSubtitle}>Browse our top categories</Text>
          {renderContent()}

        </View>
      </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F3F5F9",
    paddingVertical: 32,
    paddingHorizontal: 23,
    margin: "auto",
  },
  mainTitle: {
    fontSize: 24,
  },
  mainSubtitle: {
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
    rowGap: 8,
    marginTop: 46,
  },
});
