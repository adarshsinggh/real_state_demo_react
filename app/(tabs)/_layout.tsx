import { Tabs } from 'expo-router';
import { Chrome as Home, Search } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Platform.select({
          ios: '#007AFF',
          android: '#6200ee',
          web: '#007AFF',
        }),
        tabBarStyle: Platform.select({
          web: {
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}