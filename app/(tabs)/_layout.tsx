import { Tabs } from 'expo-router';
import { Chrome as Home, Search } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';
import { theme } from '../../components/theme';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors?.primary,
          tabBarInactiveTintColor: theme.colors?.secondaryText,
          tabBarStyle: [
            styles.tabBar,
            Platform.select({
              web: {
                borderTopWidth: 1,
                borderTopColor: theme.colors?.border,
                backgroundColor: theme.colors?.card,
                height: 60,
                paddingBottom: theme.spacing?.xs,
                paddingTop: theme.spacing?.xs,
              },
              default: {
                borderTopWidth: 1,
                borderTopColor: theme.colors?.border,
                backgroundColor: theme.colors?.card,
              },
            }),
          ],
          tabBarLabelStyle: [
            styles.tabBarLabel,
            Platform.select({
              web: {
                fontSize: 12,
                marginTop: theme.spacing?.xs,
              },
              default: {
                fontSize: 12,
              },
            }),
          ],
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
          name="search-results"
          options={{
            title: 'Results',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} />
            ),
            href: null, // Hide this tab from the tab bar
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontFamily: Platform.select({
      web: 'Inter-Regular, system-ui, -apple-system, sans-serif',
      default: 'Inter-Regular',
    }),
  },
});