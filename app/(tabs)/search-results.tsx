import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/PropertyCard';
import { theme } from '../../components/theme';
import { useLocalSearchParams } from 'expo-router';

const featuredProperties = [
  {
    name: "Luxury Penthouse",
    location: "Worli, BOM",
    price: "₹ 8.5 Cr",
    price_analysis: "Premium property in a highly sought-after location with exceptional amenities and stunning views.",
    image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
    property_url: "https://example.com/luxury-penthouse",
    key_features: ["5 BHK", "Panoramic Views", "Private Pool", "Smart Home"],
    pros: ["Prime Location", "Luxury Amenities", "High-end Finishes"],
    cons: ["High Maintenance", "Premium Price Point"]
  },
  {
    name: "Seaside Villa",
    location: "Juhu Beach, BOM",
    price: "₹ 6.2 Cr",
    price_analysis: "Beachfront property offering exceptional value with direct ocean access and modern amenities.",
    image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    property_url: "https://example.com/seaside-villa",
    key_features: ["4 BHK", "Beachfront", "Private Garden", "Wine Cellar"],
    pros: ["Ocean Views", "Private Beach Access", "Modern Design"],
    cons: ["Hurricane Insurance", "Seasonal Tourism"]
  }
];

const trendingProperties = [
  {
    name: "Urban Loft",
    location: "Brooklyn, NY",
    price: "₹ 3.8 Cr",
    price_analysis: "Industrial-chic loft space in a trendy neighborhood with excellent investment potential.",
    image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    property_url: "https://example.com/urban-loft",
    key_features: ["2 BHK", "High Ceilings", "Exposed Brick", "Artist Studio"],
    pros: ["Unique Character", "Growing Area", "Creative Space"],
    cons: ["Limited Storage", "Industrial Area"]
  },
  {
    name: "Mountain Retreat",
    location: "Bandra, BOM",
    price: "₹ 5.1 Cr",
    price_analysis: "Ski-in/ski-out property with stunning mountain views and year-round recreational access.",
    image_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
    property_url: "https://example.com/mountain-retreat",
    key_features: ["3 BHK", "Ski Access", "Stone Fireplace", "Hot Tub"],
    pros: ["Mountain Views", "Resort Amenities", "Rental Potential"],
    cons: ["Seasonal Access", "High HOA Fees"]
  }
];

export default function SearchResultsScreen() {
  const { searchResults } = useLocalSearchParams();
  const parsedResults = searchResults ? JSON.parse(searchResults as string) : [];

  const renderHorizontalRow = (title: string, data: any[], showViewAll: boolean = false) => (
    <View style={styles.rowContainer}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{title}</Text>
        {showViewAll && (
          <Text style={styles.viewAllText}>View All</Text>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        {data.map((property, index) => (
          <View style={styles.cardWrapper} key={`${property.name}-${index}`}>
            <PropertyCard 
              property={property}
              index={index}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors?.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHorizontalRow('Featured Properties', featuredProperties, true)}
        {renderHorizontalRow('Trending Now', trendingProperties, true)}
        {renderHorizontalRow('Search Results', parsedResults)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: theme.spacing?.lg,
  },
  rowContainer: {
    marginBottom: theme.spacing?.xl,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing?.lg,
    marginBottom: theme.spacing?.md,
  },
  rowTitle: {
    ...theme.typography?.subtitle,
    color: theme.colors?.text,
  },
  viewAllText: {
    ...theme.typography?.body,
    color: theme.colors?.primary,
  },
  horizontalScrollContent: {
    paddingHorizontal: theme.spacing?.md,
  },
  cardWrapper: {
    width: 320,
    marginRight: theme.spacing?.lg,
  },
});