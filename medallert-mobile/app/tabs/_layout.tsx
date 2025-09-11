import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from "@/constants/Colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { backgroundColor: "#ffffff", height: 80 }
      }}
    >
      <Tabs.Screen name="initial" options={
        { 
          title: "Home" , 
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />
        }}/>

      <Tabs.Screen name="settings" options={
        { 
          title: "Settings",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} /> 
          }} />
    </Tabs>
  );
}