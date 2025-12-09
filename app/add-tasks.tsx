
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useTaskDetails } from "@/hooks/useTaskDetails";
import { createTask, updateTask } from "@/lib/task";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTasks() {
    const router = useRouter();
    const { initialTitle, taskId, isEdit } = useLocalSearchParams<{ initialTitle: string; taskId: string; isEdit: string }>();
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
    const { task: existingTask, loading: taskLoading } = useTaskDetails(taskId ? Number(taskId) : undefined);

    const isEditing = isEdit === "true" && !!taskId;

    const [title, setTitle] = useState(initialTitle || "");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isEditing && existingTask) {
            setTitle(existingTask.title);
            setDescription(existingTask.description);
            setBudget(String(existingTask.budget));
            setLocation(existingTask.location);
            setAddress(existingTask.address || "");
            setSelectedCategoryId(existingTask.category);
        }
    }, [isEditing, existingTask]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) newErrors.title = "Title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!budget.trim()) newErrors.budget = "Budget is required";
        else if (isNaN(Number(budget))) newErrors.budget = "Budget must be a number";
        if (!location.trim()) newErrors.location = "Location is required";
        if (!selectedCategoryId) newErrors.category = "Category is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { user } = useAuth();

    const handleSubmit = async () => {
        if (!validate()) return;

        if (!user) {
            Alert.alert("Error", "You must be logged in to create a task");
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditing) {
                await updateTask(Number(taskId), {
                    title,
                    description,
                    budget: Number(budget),
                    location,
                    category: selectedCategoryId!,
                    address: address.trim() || null,
                });
                Alert.alert("Success", "Task updated successfully!", [
                    { text: "OK", onPress: () => router.back() },
                ]);
            } else {
                await createTask({
                    authorId: user.id,
                    title,
                    description,
                    budget: Number(budget),
                    location,
                    category: selectedCategoryId!,
                    address: address.trim() || undefined,
                });
                Alert.alert("Success", "Task created successfully!", [
                    { text: "OK", onPress: () => router.back() },
                ]);
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to save task");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEditing && taskLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#50FFA1" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: isEditing ? "Edit Task" : "Create Task",
                    headerStyle: { backgroundColor: "#012333" },
                    headerTintColor: "#EFFFF7",
                    headerTitleStyle: { fontWeight: "bold" },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                            <MaterialIcons name="arrow-back" size={24} color="#EFFFF7" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <FlatList
                    data={[]}
                    renderItem={null}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        <>
                            {/* Title */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Task Title</Text>
                                <TextInput
                                    style={[styles.input, errors.title && styles.inputError]}
                                    placeholder="e.g. Fix my sink"
                                    placeholderTextColor="#6C7A89"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                            </View>

                            {/* Category */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Category</Text>
                                {categoriesLoading ? (
                                    <ActivityIndicator color="#50FFA1" />
                                ) : categoriesError ? (
                                    <Text style={styles.errorText}>Failed to load categories</Text>
                                ) : (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                                        {categories.map((cat) => (
                                            <TouchableOpacity
                                                key={cat.id}
                                                style={[
                                                    styles.categoryChip,
                                                    selectedCategoryId === cat.id && styles.categoryChipSelected,
                                                ]}
                                                onPress={() => setSelectedCategoryId(cat.id)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.categoryText,
                                                        selectedCategoryId === cat.id && styles.categoryTextSelected,
                                                    ]}
                                                >
                                                    {cat.category}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                            </View>

                            {/* Description */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                                    placeholder="Describe what you need done..."
                                    placeholderTextColor="#6C7A89"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    textAlignVertical="top"
                                />
                                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                            </View>

                            {/* Budget */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Budget</Text>
                                <View style={styles.currencyInputContainer}>
                                    <Text style={styles.currencySymbol}>$</Text>
                                    <TextInput
                                        style={[styles.input, styles.currencyInput, errors.budget && styles.inputError]}
                                        placeholder="0.00"
                                        placeholderTextColor="#6C7A89"
                                        value={budget}
                                        onChangeText={setBudget}
                                        keyboardType="numeric"
                                    />
                                </View>
                                {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
                            </View>

                            {/* Location */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Location</Text>
                                <GooglePlacesAutocomplete
                                    placeholder="Search Location"
                                    onPress={(data, details = null) => {
                                        setLocation(data.description);
                                    }}
                                    query={{
                                        key: "AIzaSyCQ_Z1K7-tSJKLEGC_jefSroMkUIbUi6J0",
                                        language: "en",
                                        types: "(cities)",
                                    }}
                                    styles={{
                                        textInput: styles.input,

                                    }}
                                    listViewDisplayed={false}

                                />
                                {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                            </View>



                            {/* Address (Optional) */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address (Optional)</Text>
                                <GooglePlacesAutocomplete
                                    placeholder="Search Address"
                                    onPress={(data, details = null) => {
                                        setAddress(data.description);
                                    }}
                                    query={{
                                        key: "AIzaSyCQ_Z1K7-tSJKLEGC_jefSroMkUIbUi6J0",
                                        language: "en",
                                        types: "address",
                                    }}
                                    styles={{
                                        textInput: styles.input,
                                    }}
                                    listViewDisplayed={false}

                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#012333" />
                                ) : (
                                    <Text style={styles.submitButtonText}>{isEditing ? "Save Changes" : "Create Task"}</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    }
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#012333",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: "#EFFFF7",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "#012333",
    },
    textArea: {
        height: 100,
    },
    inputError: {
        borderWidth: 1,
        borderColor: "#FF5050",
    },
    errorText: {
        color: "#FF5050",
        fontSize: 12,
        marginTop: 4,
    },
    categoriesContainer: {
        flexDirection: "row",
    },
    categoryChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "transparent",
    },
    categoryChipSelected: {
        backgroundColor: "transparent",
        borderColor: "#50FFA1",
        borderWidth: 1,
    },
    categoryIcon: {
        fontSize: 18,
        marginRight: 8,
        color: "#EFFFF7",
    },
    categoryText: {
        color: "#EFFFF7",
        fontSize: 14,
        fontWeight: "600",
    },
    categoryTextSelected: {
        color: "#EFFFF7",
    },
    currencyInputContainer: {
        position: "relative",
    },
    currencySymbol: {
        position: "absolute",
        left: 12,
        top: 12,
        fontSize: 16,
        color: "#012333",
        zIndex: 1,
    },
    currencyInput: {
        paddingLeft: 28,
    },
    submitButton: {
        backgroundColor: "#50FFA1",
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 10,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: "#012333",
        fontSize: 18,
        fontWeight: "bold",
    },
});
