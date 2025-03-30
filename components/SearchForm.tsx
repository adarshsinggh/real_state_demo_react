import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import RNPickerSelect from 'react-native-picker-select';
import { Search } from 'lucide-react-native';
import { theme } from './theme';


export const SearchForm = ({ onSearch, loading }) => {
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyCategory, setPropertyCategory] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = () => {
    onSearch({
      city,
      area,
      maxPrice,
      propertyCategory,
      propertyType,
    });
  };

  return (
    <Animated.View 
      entering={SlideInDown.springify().damping(15)}
      style={[
        styles.container,
        Platform.select({
          ios: theme.elevation(2),
          android: theme.elevation(2),
        }),
      ]}
    >
      <Text style={[styles.title, theme.typography.title]}>
        Find Your Dream Property
      </Text>
      
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
              City
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.colors.background }
              ]}
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              placeholderTextColor={theme.colors.secondaryText}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
              Area
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.colors.background }
              ]}
              value={area}
              onChangeText={setArea}
              placeholder="Enter area"
              placeholderTextColor={theme.colors.secondaryText}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Max Price (in Cr)
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.colors.background }
            ]}
            value={maxPrice}
            onChangeText={setMaxPrice}
            placeholder="Enter maximum price"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.secondaryText}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Property Category
          </Text>
          <View style={[
            styles.pickerContainer,
            { backgroundColor: theme.colors.background }
          ]}>
            <RNPickerSelect
              onValueChange={setPropertyCategory}
              items={[
                { label: 'Residential', value: 'Residential' },
                { label: 'Commercial', value: 'Commercial' },
              ]}
              placeholder={{ label: 'Select property category', value: null }}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Property Type
          </Text>
          <View style={[
            styles.pickerContainer,
            { backgroundColor: theme.colors.background }
          ]}>
            <RNPickerSelect
              onValueChange={setPropertyType}
              items={[
                { label: 'Flat', value: 'Flat' },
                { label: 'Independent House', value: 'Independent House' },
              ]}
              placeholder={{ label: 'Select property type', value: null }}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.searchButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.searchButtonDisabled
          ]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Search size={20} color="#fff" style={styles.searchIcon} />
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search Properties'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors?.primary,
    borderRadius: theme.borderRadius?.large,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  form: {
    gap: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    ...theme.typography?.title,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderRadius: theme.borderRadius?.small,
    padding: theme.spacing.md,
    ...theme.typography?.body,
  },
  pickerContainer: {
    borderRadius: theme.borderRadius?.small,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius?.small,
    marginTop: theme.spacing.sm,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchButtonText: {
    color: '#fff',
    ...theme.typography?.body,
    fontWeight: '600',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    ...theme.typography?.body,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors?.text,
  },
  inputAndroid: {
    ...theme.typography?.body,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors?.text,
  },
};