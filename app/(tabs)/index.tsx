import { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
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

interface SearchResponse {
  data: {
    selected_properties: Array<{
      name: string;
      location: string;
      price: string;
      image_url: string;
      key_features: string[];
      pros: string[];
      cons: string[];
    }>;
  };
}

export default function SearchScreen() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [useApi, setUseApi] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!searchParams) return;
      
      setLoading(true);
      
      if (!searchParams.useApi) {
        setTimeout(() => {
          if (isMounted) {
            setSearchResults(mockData);
            setLoading(false);
          }
        }, 1000);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/properties/search', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'x-firecrawl-api-key': 'fc-b118bab204a84h2cscdf9g224dc95439',
            'x-openai-api-key': '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',
            'x-model-id': 'o3-mini',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            city: searchParams.city,
            area: searchParams.area,
            max_price: parseFloat(searchParams.maxPrice),
            property_category: searchParams.propertyCategory,
            property_type: searchParams.propertyType,
          }),
        });
        const data = await response.json();
        if (isMounted) {
          setSearchResults(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (searchParams) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handleSearch = useCallback((params: SearchParams) => {
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
        ) : searchResults?.data?.selected_properties ? (
          <Animated.View 
            entering={FadeIn}
            style={styles.resultsContainer}
          >
            {searchResults.data.selected_properties.map((property, index) => (
              <PropertyCard 
                key={property.name} 
                property={property}
                index={index}
              />
            ))}
          </Animated.View>
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
    paddingBottom: theme.spacing.lg,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  resultsContainer: {
    padding: theme.spacing.md,
  },
});