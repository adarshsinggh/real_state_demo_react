import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions, Linking, Animated } from 'react-native';
import { Heart, MapPin, Chrome as Home, Star, ArrowUpRight } from 'lucide-react-native';
import { theme } from './theme';
import { useState, useRef } from 'react';

interface PropertyCardProps {
  property: {
    name: string;
    location: string;
    price: string;
    price_analysis: string;
    image_url: string;
    property_url: string;
    key_features: string[];
    pros: string[];
    cons: string[];
  };
  index: number;
}

const { width } = Dimensions.get('window');

export const PropertyCard = ({ property, index }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePropertyPress = async () => {
    try {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      const supported = await Linking.canOpenURL(property.property_url);
      
      if (supported) {
        await Linking.openURL(property.property_url);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleLikePress = () => {
    setIsLiked(!isLiked);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <View
        style={[
          styles.card,
          Platform.select({
            ios: theme.elevation(2),
            android: theme.elevation(2),
            web: theme.elevation(2),
          }),
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.image_url }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={[
              styles.heartButton,
              isLiked && styles.heartButtonActive
            ]}
            onPress={handleLikePress}
          >
            <Heart 
              size={20} 
              color={isLiked ? theme.colors.error : '#fff'} 
              fill={isLiked ? theme.colors.error : 'none'}
            />
          </TouchableOpacity>
          <View style={styles.priceContainer}>
            <Star size={16} color="#FFD700" fill="#FFD700" style={styles.starIcon} />
            <Text style={styles.priceText}>{property.price}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.headerSection}>
            <Text style={styles.propertyName} numberOfLines={1}>
              {property.name}
            </Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.colors.secondaryText} />
              <Text style={styles.propertyLocation} numberOfLines={1}>
                {property.location}
              </Text>
            </View>
          </View>

          <View style={styles.featuresGrid}>
            {property.key_features.map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Home size={16} color={theme.colors.primary} style={styles.featureIcon} />
                <Text style={styles.featureText} numberOfLines={1}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.analysisContainer}>
            <Text style={styles.analysisText} numberOfLines={2}>
              {property.price_analysis}
            </Text>
          </View>

          <View style={styles.prosConsContainer}>
            <View style={styles.prosList}>
              {property.pros.map((pro, idx) => (
                <View key={idx} style={styles.proItem}>
                  <View style={[styles.indicator, styles.proIndicator]} />
                  <Text style={styles.proText} numberOfLines={1}>{pro}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.consList}>
              {property.cons.map((con, idx) => (
                <View key={idx} style={styles.conItem}>
                  <View style={[styles.indicator, styles.conIndicator]} />
                  <Text style={styles.conText} numberOfLines={1}>{con}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.viewButton}
            onPress={handlePropertyPress}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
            <ArrowUpRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors?.card,
    borderRadius: 24,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 260,
    backgroundColor: '#f5f5f5',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 10,
    zIndex: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          transform: 'scale(1.1)',
        },
      },
    }),
  },
  heartButtonActive: {
    backgroundColor: '#fff',
    ...theme.elevation(1),
  },
  priceContainer: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
      },
    }),
  },
  starIcon: {
    marginRight: 8,
  },
  priceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors?.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  propertyLocation: {
    fontSize: 15,
    color: theme.colors?.secondaryText,
    flex: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors?.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '48%',
  },
  featureIcon: {
    marginRight: 6,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors?.primary,
    fontWeight: '500',
  },
  analysisContainer: {
    backgroundColor: theme.colors?.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  analysisText: {
    fontSize: 15,
    color: theme.colors?.secondaryText,
    lineHeight: 22,
  },
  prosConsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  prosList: {
    flex: 1,
    gap: 8,
  },
  consList: {
    flex: 1,
    gap: 8,
  },
  proItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  conItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  proIndicator: {
    backgroundColor: theme.colors?.success,
  },
  conIndicator: {
    backgroundColor: theme.colors?.error,
  },
  proText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors?.success,
  },
  conText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors?.error,
  },
  viewButton: {
    backgroundColor: theme.colors?.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          transform: 'scale(1.02)',
        },
      },
    }),
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});