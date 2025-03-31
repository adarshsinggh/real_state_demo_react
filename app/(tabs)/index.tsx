import { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Platform, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchForm } from '../../components/SearchForm';
import { PropertyCard } from '../../components/PropertyCard';
import { mockData } from '../../data/mockData';
import { theme } from '../../components/theme';

interface SearchParams {
  city: string;
  area: string;
  maxPrice: string;
  propertyCategory: string;
  propertyType: string;
  useApi: boolean;
}

interface Property {
  name: string;
  location: string;
  price: string;
  image_url: string;
  key_features: string[];
  pros: string[];
  cons: string[];
}

interface SearchResponse {
  data: {
    selected_properties: Property[];
  };
}

// Set your computer's IP address
const YOUR_COMPUTER_IP = '192.168.1.XXX'; // Replace with your actual IP!

export default function SearchScreen() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!searchParams) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!searchParams.useApi) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (mounted.current) {
            // Make sure we're extracting the array of properties correctly from mock data
            if (mockData && mockData.data && Array.isArray(mockData.data.selected_properties)) {
              setSearchResults(mockData.data.selected_properties);
              console.log("Setting mock results:", mockData.data.selected_properties.length, "properties");
            } else {
              console.error("Mock data structure incorrect:", mockData);
              setError("Invalid mock data structure");
            }
          }
          return;
        }

        // Choose the appropriate API URL based on platform and environment
        let apiBaseUrl;
        
        if (Platform.OS === 'android') {
          if (Platform.constants.uiMode?.includes('emulator')) {
            apiBaseUrl = 'http://10.0.2.2:8000'; // Android emulator
          } else {
            apiBaseUrl = `http://${YOUR_COMPUTER_IP}:8000`; // Physical Android device
          }
        } else if (Platform.OS === 'ios') {
          const isSimulator = Platform.constants.systemName?.includes('Simulator');
          if (isSimulator) {
            apiBaseUrl = 'http://localhost:8000'; // iOS simulator
          } else {
            apiBaseUrl = `http://localhost:8000`; // Physical iOS device
          }
        } else {
          apiBaseUrl = 'http://localhost:8000'; // Web
        }

        console.log(`Fetching from API: ${apiBaseUrl}/api/properties/search`);
        
        // Parse maxPrice to a number
        let maxPriceValue = 5.0; // Default
        if (searchParams.maxPrice) {
          // Extract numeric value from price string (remove ₹, L, Cr, etc.)
          const priceMatch = searchParams.maxPrice.match(/[0-9.]+/);
          if (priceMatch) {
            maxPriceValue = parseFloat(priceMatch[0]);
            // Convert crores to raw value if needed
            if (searchParams.maxPrice.includes('Cr')) {
              maxPriceValue = maxPriceValue * 100;
            }
          }
        }

        // For debugging: log the request details
        const requestBody = {
          city: searchParams.city.toLowerCase(),
          area: searchParams.area.toLowerCase(),
          max_price: 5.00,
          property_category: searchParams.propertyCategory,
          property_type: searchParams.propertyType,
        };
        console.log('Request body:', JSON.stringify(requestBody));

        const response = await fetch(`${apiBaseUrl}/api/properties/search`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'x-model-id': 'o3-mini',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Network response was not ok (${response.status}): ${errText}`);
        }

        const responseData = await response.json();
        console.log("API Response:", JSON.stringify(responseData).substring(0, 200) + "...");

        if (mounted.current) {
          // Handle different response structures
          if (responseData && responseData.data && Array.isArray(responseData.data.selected_properties)) {
            // Standard expected format
            setSearchResults(responseData.data.selected_properties);
            console.log("Setting API results:", responseData.data.selected_properties.length, "properties");
          } else if (responseData && Array.isArray(responseData.selected_properties)) {
            // Alternative format
            setSearchResults(responseData.selected_properties);
            console.log("Setting API results (alt format):", responseData.selected_properties.length, "properties");
          } else if (responseData && Array.isArray(responseData)) {
            // Direct array format
            setSearchResults(responseData);
            console.log("Setting API results (direct array):", responseData.length, "properties");
          } else {
            console.error("Response structure unexpected:", responseData);
            setError("Unexpected API response structure");
            // Try to extract anything that looks like property data
            let foundProperties = [];
            try {
              // Search through the response for any array that might contain our properties
              const searchForArrays = (obj, path = '') => {
                if (!obj || typeof obj !== 'object') return;
                
                Object.keys(obj).forEach(key => {
                  const newPath = path ? `${path}.${key}` : key;
                  if (Array.isArray(obj[key]) && obj[key].length > 0 && obj[key][0].name) {
                    console.log(`Found possible property array at ${newPath}:`, obj[key].length, "items");
                    foundProperties = obj[key];
                  } else if (typeof obj[key] === 'object') {
                    searchForArrays(obj[key], newPath);
                  }
                });
              };
              
              searchForArrays(responseData);
              
              if (foundProperties.length > 0) {
                console.log("Found properties in unexpected location, using them anyway");
                setSearchResults(foundProperties);
                setError(null);
              }
            } catch (e) {
              console.error("Error while searching response for properties:", e);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (mounted.current) {
          setError(`Failed to fetch data: ${error.message}`);
          setSearchResults([]);
          
          Alert.alert(
            "Error",
            `Failed to process search results: ${error.message}`,
            [{ text: "OK" }]
          );
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [searchParams]);

  const handleSearch = useCallback((params: SearchParams) => {
    // Reset any previous results when starting a new search
    setSearchResults([]);
    setError(null);
    setSearchParams(params);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors?.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SearchForm onSearch={handleSearch} loading={loading} />
        
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator 
              size="large" 
              color={theme.colors?.primary}
            />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>
              Please check your network connection and try again.
            </Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            {searchResults.map((property, index) => (
              <PropertyCard 
                key={`${property.name || 'property'}-${index}`}
                property={property}
                index={index}
              />
            ))}
          </View>
        ) : searchParams ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No properties found</Text>
            <Text style={styles.noResultsHint}>
              Try adjusting your search criteria.
            </Text>
          </View>
        ) : null}
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
    paddingBottom: theme.spacing?.lg,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing?.xl,
  },
  resultsContainer: {
    padding: theme.spacing?.md,
  },
  errorContainer: {
    padding: theme.spacing?.lg,
    margin: theme.spacing?.md,
    backgroundColor: '#FFF1F0',
    borderRadius: theme.borderRadius?.medium,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors?.error,
  },
  errorText: {
    color: theme.colors?.error,
    ...theme.typography?.body,
    fontWeight: '600',
    marginBottom: theme.spacing?.sm,
  },
  errorHint: {
    color: theme.colors?.secondaryText,
    ...theme.typography?.body,
  },
  noResultsContainer: {
    padding: theme.spacing?.lg,
    margin: theme.spacing?.md,
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius?.medium,
    alignItems: 'center',
  },
  noResultsText: {
    ...theme.typography?.subtitle,
    marginBottom: theme.spacing?.sm,
  },
  noResultsHint: {
    color: theme.colors?.secondaryText,
    ...theme.typography?.body,
    textAlign: 'center',
  },
});