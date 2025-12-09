import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderAction {
  label: string;
  onPress: () => void;
}

interface HeaderProps {
  actions?: HeaderAction[];
};

const Header = ({ actions = [] }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error("Failed to sign out", e);
    }
  };

  const displayRole = useMemo(() => {
    if (user?.profile?.role === "employeer") return "Employer";
    if (user?.profile?.role === "worker") return "Worker";
    return "Guest";
  }, [user?.profile?.role]);

  const showUserInfo = !!user;

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <Text style={styles.headerLogoText}>LOGO</Text>

      <View style={styles.headerRightContainer}>
        {showUserInfo ? (
          <>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userNameText}>{user?.profile?.name}</Text>
              <Text style={styles.userRoleText}>{displayRole}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.headerActionsContainer}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.button}
                activeOpacity={0.8}
                onPress={action.onPress}
              >
                <Text style={styles.buttonText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#012333",
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLogoText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#50FFA1",
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  headerActionsContainer: {
    flexDirection: "row",
    columnGap: 8,
  },
  button: {
    borderColor: "#50FFA1",
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#EFFFF7",
  },
  userInfoContainer: {
    alignItems: "flex-end",
  },
  userNameText: {
    color: "#EFFFF7",
    fontWeight: "700",
  },
  userRoleText: {
    color: "#A3B4C4",
    fontSize: 12,
  },
});
