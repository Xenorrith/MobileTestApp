import Header from "@/components/Header";
import { Href, usePathname, useRouter } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Account from "../../assets/images/Bottom_Nav_Bar_Icon_Account.svg";
import Done from "../../assets/images/Bottom_Nav_Bar_Icon_check_circle.svg";
import Messages from "../../assets/images/Bottom_Nav_Bar_Icon_Messages.svg";
import Search from "../../assets/images/Bottom_Nav_Bar_Icon_Search.svg";
import Tasks from "../../assets/images/Bottom_Nav_Bar_Icon_Tasks.svg";

type NavLink = {
  name: string;
  href: Href;
  icon: React.ReactNode;
  label: string;
};

const links: NavLink[] = [
  {
    name: "index",
    href: "/",
    icon: <Done />,
    label: "Get it Done",
  },
  {
    name: "browse",
    href: "/browse",
    icon: <Search />,
    label: "Browse",
  },
  {
    name: "my-tasks",
    href: "/my-tasks",
    icon: <Tasks />,
    label: "My Tasks",
  },
  {
    name: "messages",
    href: "/messages",
    icon: <Messages />,
    label: "Messages",
  },
  {
    name: "account",
    href: "/account",
    icon: <Account />,
    label: "Account",
  },
];

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Header
        actions={[
          {
            label: "Sign In",
            onPress: () => router.push("/auth/login"),
          },
          {
            label: "Sign Up",
            onPress: () => router.push("/auth/register"),
          },
        ]}
      />
      <Tabs>
        <TabSlot />
        <TabList style={[styles.container, { paddingBottom: insets.bottom }]}>
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href as string));
            return (
              <TabTrigger name={link.name} href={link.href} key={link.name}>
                <View
                  style={[
                    styles.link,
                    {
                      backgroundColor: isActive ? "#50FFA1" : "transparent",
                    },
                  ]}
                >
                  {link.icon}
                  <Text style={styles.label}>{link.label}</Text>
                </View>
              </TabTrigger>
            );
          })}
        </TabList>
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#F3F5F9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: 6,
    borderRadius: 8,
    minWidth: 60,
  },
  label: {
    fontSize: 10,
    color: "#000",
    fontWeight: "500",
  },
});
