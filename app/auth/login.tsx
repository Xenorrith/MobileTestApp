import { signInWithEmail } from "@/lib/auth";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; root?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string; root?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({}); // Clear previous errors
      await signInWithEmail({ email, password });
      router.replace("/");
    } catch (e: any) {
      console.log(e);
      setErrors((prev) => ({
        ...prev,
        root: e.message || "Invalid email or password",
      }));
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
        <Text style={styles.title}>Login</Text>

        <Text style={styles.subtitle}>Sign in to your account</Text>

        {errors.root && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errors.root}</Text>
          </View>
        )}

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
              setErrors((prev) => ({ ...prev, email: undefined, root: undefined }));
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>

          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#6C7A89"
            secureTextEntry
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: undefined, root: undefined }));
            }}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.submitButton}
          onPress={handleLogin}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/auth/register" style={styles.footerLink}>
            Sign Up
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;

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

  errorBanner: {
    backgroundColor: "rgba(255, 76, 76, 0.1)",
    borderWidth: 1,
    borderColor: "#FF4C4C",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorBannerText: {
    color: "#FF4C4C",
    fontSize: 14,
    textAlign: "center",
  },
});