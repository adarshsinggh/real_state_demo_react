import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { theme } from './theme';

const { width } = Dimensions.get('window');

export const PropertyCard = ({ property, index }) => {
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AnimatedTouchable
      entering={FadeInUp.delay(index * 200)}
      exiting={FadeOut}
      style={[
        styles.card,
        Platform.select({
          ios: theme.elevation(2),
          android: theme.elevation(2),
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
            Platform.select({
              ios: { backgroundColor: 'rgba(0,0,0,0.3)' },
              android: { backgroundColor: theme.colors.primary },
            }),
          ]}
        >
          <Heart size={24} color="#fff" />
        </TouchableOpacity>
        <View style={[
          styles.priceTag,
          { backgroundColor: theme.colors.primary }
        ]}>
          <Text style={styles.priceText}>{property.price}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.propertyName, theme.typography.subtitle]}>
          {property.name}
        </Text>
        <Text style={[styles.propertyLocation, { color: theme.colors.secondaryText }]}>
          {property.location}
        </Text>
        
        <View style={styles.featuresContainer}>
          {property.key_features.map((feature, idx) => (
            <View key={idx} style={[
              styles.featureTag,
              { backgroundColor: theme.colors.background }
            ]}>
              <Text style={[
                styles.featureText,
                { color: theme.colors.secondaryText }
              ]}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.prosConsContainer}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, theme.typography.body]}>Pros</Text>
            {property.pros.map((pro, idx) => (
              <Text key={idx} style={[styles.proText, { color: theme.colors.success }]}>
                ✓ {pro}
              </Text>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, theme.typography.body]}>Cons</Text>
            {property.cons.map((con, idx) => (
              <Text key={idx} style={[styles.conText, { color: theme.colors.error }]}>
                ✗ {con}
              </Text>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.viewButton,
            { backgroundColor: theme.colors.primary }
          ]}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors?.card,
    borderRadius: theme.borderRadius?.medium,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 220,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    borderRadius: 50,
    padding: theme.spacing.sm,
  },
  priceTag: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius?.small,
  },
  priceText: {
    color: '#fff',
    ...theme.typography?.body,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  propertyName: {
    marginBottom: theme.spacing.xs,
  },
  propertyLocation: {
    marginBottom: theme.spacing.md,
    ...theme.typography?.body,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  featureTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius?.small,
  },
  featureText: {
    ...theme.typography?.caption,
  },
  prosConsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  proText: {
    ...theme.typography?.body,
    marginBottom: theme.spacing.xs,
  },
  conText: {
    ...theme.typography?.body,
    marginBottom: theme.spacing.xs,
  },
  viewButton: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius?.small,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    ...theme.typography?.body,
    fontWeight: '600',
  },
});