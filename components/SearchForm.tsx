import { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Modal, Switch } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Search, FileSliders as Sliders, ChevronDown } from 'lucide-react-native';
import { theme } from './theme';

interface SearchFormProps {
  onSearch: (params: {
    city: string;
    area: string;
    maxPrice: string;
    propertyCategory: string;
    propertyType: string;
    useApi: boolean;
  }) => void;
  loading: boolean;
}

const cityData: Record<string, string[]> = {
  'Mumbai': ['Andheri East', 'Bandra West', 'Powai', 'Worli', 'Juhu'],
  'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'JP Nagar'],
  'Delhi': ['South Extension', 'Dwarka', 'Vasant Kunj', 'Greater Kailash', 'Rohini'],
};

const formatPrice = (value: string) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';
  
  if (numValue >= 100) {
    return `₹${(numValue / 100).toFixed(2)} Cr`;
  }
  return `₹${numValue} L`;
};

export const SearchForm = ({ onSearch, loading }: SearchFormProps) => {
  const [useApi, setUseApi] = useState(false);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [propertyCategory, setPropertyCategory] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const mounted = useRef(true);

  const handleCityChange = useCallback((value: string) => {
    if (mounted.current) {
      setCity(value);
      setArea('');
    }
  }, []);

  const handlePriceSelect = useCallback(() => {
    if (mounted.current && priceInput) {
      setMaxPrice(formatPrice(priceInput));
      setShowPriceModal(false);
    }
  }, [priceInput]);

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

  const renderPickerField = (label, value, placeholder, items, onValueChange, disabled = false) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
          {label}
        </Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            style={[styles.pickerWrapper, { backgroundColor: theme.colors.background }]}
            activeOpacity={disabled ? 0.4 : 0.7}
            disabled={disabled}
          >
            <RNPickerSelect
              value={value}
              onValueChange={onValueChange}
              items={items}
              placeholder={{ label: placeholder, value: '' }}
              style={{
                ...pickerSelectStyles,
                iconContainer: styles.iconContainer
              }}
              useNativeAndroidPickerStyle={false}
              disabled={disabled}
              Icon={() => <ChevronDown size={20} color={theme.colors.primary} />}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.pickerContainer, { backgroundColor: theme.colors.background }]}>
            <RNPickerSelect
              value={value}
              onValueChange={onValueChange}
              items={items}
              placeholder={{ label: placeholder, value: '' }}
              style={pickerSelectStyles}
              disabled={disabled}
              useNativeAndroidPickerStyle={false}
              Icon={() => <ChevronDown size={20} color={theme.colors.primary} />}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View 
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
          {renderPickerField(
            'City',
            city,
            'Select city',
            Object.keys(cityData).map(city => ({ label: city, value: city })),
            handleCityChange
          )}
          
          {renderPickerField(
            'Area',
            area,
            'Select area',
            (cityData[city] || []).map(area => ({ label: area, value: area })),
            setArea,
            !city
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Max Price
          </Text>
          <TouchableOpacity
            style={[styles.priceInput, { backgroundColor: theme.colors.background }]}
            onPress={() => setShowPriceModal(true)}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.input, 
                !maxPrice && {color: theme.colors.secondaryText}
              ]}
            >
              {maxPrice || "Select maximum price"}
            </Text>
            <Sliders size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {renderPickerField(
          'Property Category',
          propertyCategory,
          'Select property category',
          [
            { label: 'Residential', value: 'Residential' },
            { label: 'Commercial', value: 'Commercial' },
          ],
          setPropertyCategory
        )}

        {renderPickerField(
          'Property Type',
          propertyType,
          'Select property type',
          [
            { label: 'Flat', value: 'Flat' },
            { label: 'Independent House', value: 'Independent House' },
          ],
          setPropertyType
        )}

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
              Enter Maximum Price
            </Text>
            <TextInput
              style={[styles.priceInputField, { borderColor: theme.colors.border, color: theme.colors.text }]}
              value={priceInput}
              onChangeText={setPriceInput}
              placeholder="Enter price in lakhs (e.g., 50 for ₹50L)"
              placeholderTextColor={theme.colors.secondaryText}
              keyboardType="numeric"
              autoFocus={true}
              clearButtonMode="while-editing"
            />
            <Text style={[styles.priceHint, { color: theme.colors.secondaryText }]}>
              Enter value in lakhs. For crores, enter values above 100.
            </Text>
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
    </View>
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
  iconContainer: {
    top: 10,
    right: 12,
  },
  pickerContainer: {
    borderRadius: theme.borderRadius?.small,
    position: 'relative',
  },
  pickerWrapper: {
    borderRadius: theme.borderRadius?.small,
    position: 'relative',
    padding: 0,
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
  priceInputField: {
    ...theme.typography?.body,
    borderWidth: 1,
    borderRadius: theme.borderRadius?.small,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    width: '100%',
  },
  priceHint: {
    ...theme.typography?.caption,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
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
    width: '100%',
    height: 44,
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