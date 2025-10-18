import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { backgroundColor: "#ffffff", height: 80 },
      }}
    >
      <Tabs.Screen
        name="initial"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
      name="medication"
      options={{
        title: "Medications",
        tabBarIcon: ({ color }) => (
          <FontAwesome size={28} name="medkit" color={color} />
        ),
      }}
      />

       <Tabs.Screen
      name="treatment"
      options={{
        title: "Treatments",
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="file-medical-alt" size={24} color={color} />
        ),
      }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
