import { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Platform, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchForm } from '../../components/SearchForm';
import { mockData } from '../../data/mockData';
import { theme } from '../../components/theme';
import { router } from 'expo-router';

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

        let searchResults: Property[] = [];

        if (!searchParams.useApi) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (mounted.current) {
            if (mockData && mockData.data && Array.isArray(mockData.data.selected_properties)) {
              searchResults = mockData.data.selected_properties;
              console.log("Setting mock results:", mockData.data.selected_properties.length, "properties");
            } else {
              console.error("Mock data structure incorrect:", mockData);
              setError("Invalid mock data structure");
              return;
            }
          }
        } else {
          let apiBaseUrl;
          
          if (Platform.OS === 'android') {
            if (Platform.constants.uiMode?.includes('emulator')) {
              apiBaseUrl = 'http://10.0.2.2:8000';
            } else {
              apiBaseUrl = `http://${YOUR_COMPUTER_IP}:8000`;
            }
          } else if (Platform.OS === 'ios') {
            const isSimulator = Platform.constants.systemName?.includes('Simulator');
            if (isSimulator) {
              apiBaseUrl = 'http://localhost:8000';
            } else {
              apiBaseUrl = `http://localhost:8000`;
            }
          } else {
            apiBaseUrl = 'http://localhost:8000';
          }

          console.log(`Fetching from API: ${apiBaseUrl}/api/properties/search`);
          
          let maxPriceValue = 5.0;
          if (searchParams.maxPrice) {
            const priceMatch = searchParams.maxPrice.match(/[0-9.]+/);
            if (priceMatch) {
              maxPriceValue = parseFloat(priceMatch[0]);
              if (searchParams.maxPrice.includes('Cr')) {
                maxPriceValue = maxPriceValue * 100;
              }
            }
          }

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
            if (responseData && responseData.data && Array.isArray(responseData.data.selected_properties)) {
              searchResults = responseData.data.selected_properties;
            } else if (responseData && Array.isArray(responseData.selected_properties)) {
              searchResults = responseData.selected_properties;
            } else if (responseData && Array.isArray(responseData)) {
              searchResults = responseData;
            } else {
              console.error("Response structure unexpected:", responseData);
              setError("Unexpected API response structure");
              return;
            }
          }
        }

        if (mounted.current) {
          // Navigate to search results screen with the results
          router.push({
            pathname: '/search-results',
            params: { searchResults: JSON.stringify(searchResults) }
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (mounted.current) {
          setError(`Failed to fetch data: ${error.message}`);
          
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
});