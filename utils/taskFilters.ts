import type { Task } from "@/lib/task";

export const filterTasks = (
  tasks: Task[],
  searchQuery: string,
  selectedCategoryIds: number[]
): Task[] => {
  const query = searchQuery.trim().toLowerCase();
  return tasks.filter((task) => {
    const matchesSearch = query
      ? `${task.title} ${task.description}`.toLowerCase().includes(query)
      : true;
    const matchesCategory = selectedCategoryIds.length
      ? selectedCategoryIds.includes(task.category)
      : true;
    return matchesSearch && matchesCategory;
  });
};

export const sortTasks = (
  tasks: Task[],
  sortOption: "date" | "price" | "title"
): Task[] => {
  const copy = [...tasks];
  switch (sortOption) {
    case "price":
      return copy.sort((a, b) => b.budget - a.budget);
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "date":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
      );
  }
};

