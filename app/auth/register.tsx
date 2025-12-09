import { useAuth } from "@/hooks/useAuth";
import { signUpWithEmail } from "@/lib/auth";
import { UserType } from "@/types/user";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Register = () => {
  const [userType, setUserType] = useState<UserType>("worker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleRegister = async () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await signUpWithEmail({
        email,
        password,
        userType,
        name,
      });
      await refreshUser();
      router.replace("/");
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Registration</Text>

        <Text style={styles.subtitle}>Create a new account</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name</Text>

          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#6C7A89"
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>User Type</Text>

          <View style={styles.userTypeRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.userTypeButton,

                userType === "worker" && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType("worker")}
            >
              <Text
                style={[
                  styles.userTypeText,

                  userType === "worker" && styles.userTypeTextActive,
                ]}
              >
                Worker
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.userTypeButton,

                userType === "employeer" && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType("employeer")}
            >
              <Text
                style={[
                  styles.userTypeText,

                  userType === "employeer" && styles.userTypeTextActive,
                ]}
              >
                Employer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#6C7A89"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>

          <TextInput
            placeholder="Enter password (min. 6 characters)"
            placeholderTextColor="#6C7A89"
            secureTextEntry
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>

          <TextInput
            placeholder="Repeat password"
            placeholderTextColor="#6C7A89"
            secureTextEntry
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.submitButton}
          onPress={handleRegister}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            Sign up as {userType === "worker" ? "Worker" : "Employer"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>You already sign in?</Text>
          <Link href="/auth/login" style={styles.footerLink}>
            Sign in
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    paddingHorizontal: 24,

    paddingVertical: 32,

    backgroundColor: "#012333",
  },

  formWrapper: {
    flex: 1,

    gap: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#EFFFF7",
    marginBottom: 4,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#A3B4C4",
    marginBottom: 16,
    textAlign: "center",
  },

  fieldGroup: {
    gap: 8,
  },

  label: {
    fontSize: 14,

    color: "#EFFFF7",
  },

  input: {
    borderRadius: 10,

    borderWidth: 1,

    borderColor: "#26465A",

    paddingHorizontal: 14,

    paddingVertical: 12,

    color: "#EFFFF7",

    backgroundColor: "#022738",
  },

  inputError: {
    borderColor: "#FF4C4C",
  },

  errorText: {
    color: "#FF4C4C",
    fontSize: 12,
    marginTop: -4,
  },

  userTypeRow: {
    flexDirection: "row",

    columnGap: 12,
  },

  userTypeButton: {
    flex: 1,

    borderRadius: 10,

    borderWidth: 1,

    borderColor: "#26465A",

    paddingVertical: 12,

    alignItems: "center",

    backgroundColor: "transparent",
  },

  userTypeButtonActive: {
    backgroundColor: "#50FFA1",

    borderColor: "#50FFA1",
  },

  userTypeText: {
    fontSize: 14,

    fontWeight: "600",

    color: "#EFFFF7",
  },

  userTypeTextActive: {
    color: "#012333",
  },

  submitButton: {
    marginTop: 24,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#50FFA1",
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#012333",
    textAlign: "center",
  },

  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 6,
  },

  footerText: {
    fontSize: 14,
    color: "#A3B4C4",
    textAlign: "center",
  },

  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#50FFA1",
    textAlign: "center",
  },
});
