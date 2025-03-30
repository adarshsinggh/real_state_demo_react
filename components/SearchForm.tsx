import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Modal, Switch } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import RNPickerSelect from 'react-native-picker-select';
import { Search, FileSliders as Sliders } from 'lucide-react-native';
import Slider from 'react-native-slider';
import { theme } from './theme';

// City data structure
const cityData = {
  'Mumbai': ['Andheri East', 'Bandra West', 'Powai', 'Worli', 'Juhu'],
  'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'JP Nagar'],
  'Delhi': ['South Extension', 'Dwarka', 'Vasant Kunj', 'Greater Kailash', 'Rohini'],
};

const formatPrice = (value: number) => {
  if (value >= 100) {
    return `₹${(value / 100).toFixed(2)} Cr`;
  }
  return `₹${value} L`;
};

export const SearchForm = ({ onSearch, loading }) => {
  const [useApi, setUseApi] = useState(false);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(100); // Start at 1 Cr
  const [propertyCategory, setPropertyCategory] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleCityChange = useCallback((value: string) => {
    setCity(value);
    setArea(''); // Reset area when city changes
  }, []);

  const handlePriceSelect = useCallback(() => {
    setMaxPrice(formatPrice(sliderValue));
    setShowPriceModal(false);
  }, [sliderValue]);

  const handleSearch = useCallback(() => {
    onSearch({
      city,
      area,
      maxPrice,
      propertyCategory,
      propertyType,
      useApi,
    });
  }, [city, area, maxPrice, propertyCategory, propertyType, useApi, onSearch]);

  return (
    <Animated.View 
      entering={SlideInDown.springify().damping(15)}
      style={[
        styles.container,
        Platform.select({
          ios: theme.elevation(2),
          android: theme.elevation(2),
          web: theme.elevation(2),
        }),
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, theme.typography.title]}>
          Find Your Dream Property
        </Text>
        <View style={styles.apiSwitch}>
          <Text style={[styles.switchLabel, { color: theme.colors.secondaryText }]}>
            Use API
          </Text>
          <Switch
            value={useApi}
            onValueChange={setUseApi}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
          />
        </View>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
              City
            </Text>
            <View style={[
              styles.pickerContainer,
              { backgroundColor: theme.colors.background }
            ]}>
              <RNPickerSelect
                value={city}
                onValueChange={handleCityChange}
                items={Object.keys(cityData).map(city => ({
                  label: city,
                  value: city,
                }))}
                placeholder={{ label: 'Select city', value: '' }}
                style={pickerSelectStyles}
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
              Area
            </Text>
            <View style={[
              styles.pickerContainer,
              { backgroundColor: theme.colors.background }
            ]}>
              <RNPickerSelect
                value={area}
                onValueChange={setArea}
                items={(cityData[city] || []).map(area => ({
                  label: area,
                  value: area,
                }))}
                placeholder={{ label: 'Select area', value: '' }}
                style={pickerSelectStyles}
                disabled={!city}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Max Price
          </Text>
          <TouchableOpacity
            style={[styles.priceInput, { backgroundColor: theme.colors.background }]}
            onPress={() => setShowPriceModal(true)}
          >
            <TextInput
              style={styles.input}
              value={maxPrice}
              placeholder="Select maximum price"
              placeholderTextColor={theme.colors.secondaryText}
              editable={false}
            />
            <Sliders size={20} color={theme.colors.primary} />
          </TouchableOpacity>
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
              value={propertyCategory}
              onValueChange={setPropertyCategory}
              items={[
                { label: 'Residential', value: 'Residential' },
                { label: 'Commercial', value: 'Commercial' },
              ]}
              placeholder={{ label: 'Select property category', value: '' }}
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
              value={propertyType}
              onValueChange={setPropertyType}
              items={[
                { label: 'Flat', value: 'Flat' },
                { label: 'Independent House', value: 'Independent House' },
              ]}
              placeholder={{ label: 'Select property type', value: '' }}
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

      <Modal
        visible={showPriceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPriceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, theme.typography.subtitle]}>
              Select Maximum Price
            </Text>
            <Text style={[styles.priceDisplay, { color: theme.colors.primary }]}>
              {formatPrice(sliderValue)}
            </Text>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              minimumValue={10} // 10L
              maximumValue={2000} // 20Cr
              step={10}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
              style={styles.slider}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPriceModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.error }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.selectButton, { backgroundColor: theme.colors.primary }]}
                onPress={handlePriceSelect}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Select
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors?.card,
    borderRadius: theme.borderRadius?.large,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    flex: 1,
  },
  apiSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  switchLabel: {
    ...theme.typography?.body,
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
    ...theme.typography?.body,
    marginBottom: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography?.body,
    color: theme.colors?.text,
  },
  pickerContainer: {
    borderRadius: theme.borderRadius?.small,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius?.small,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.select({
      ios: theme.spacing.sm,
      android: 0,
      web: theme.spacing.sm,
    }),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: theme.borderRadius?.large,
    padding: theme.spacing.xl,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  priceDisplay: {
    ...theme.typography?.title,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  slider: {
    marginBottom: theme.spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius?.small,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  selectButton: {
    backgroundColor: theme.colors?.primary,
  },
  modalButtonText: {
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
  inputWeb: {
    ...theme.typography?.body,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors?.text,
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
  },
};