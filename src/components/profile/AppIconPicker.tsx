import { memo, useCallback, useEffect, useState } from 'react';
import { Alert, Image, type ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { changeIcon, getIcon } from 'react-native-change-icon';
import { useTheme } from '../../theme/ThemeContext';

type IconVariant = {
  id: string;
  label: string;
  bgColor: string;
  aliasName: string;
  image: ImageSourcePropType;
};

const ICON_VARIANTS: IconVariant[] = [
  {
    id: 'default',
    label: 'Classic Blue',
    bgColor: '#E6F4FE',
    aliasName: 'Default',
    image: require('../../../assets/app-icons/icon_default.webp'),
  },
  {
    id: 'purple',
    label: 'Royal Purple',
    bgColor: '#EDE9FE',
    aliasName: 'Purple',
    image: require('../../../assets/app-icons/icon_purple.png'),
  },
  {
    id: 'green',
    label: 'Emerald',
    bgColor: '#D1FAE5',
    aliasName: 'Green',
    image: require('../../../assets/app-icons/icon_green.png'),
  },
  {
    id: 'orange',
    label: 'Sunset',
    bgColor: '#FFEDD5',
    aliasName: 'Orange',
    image: require('../../../assets/app-icons/icon_orange.png'),
  },
];

function AppIconPickerBase() {
  const { isDark } = useTheme();
  const [activeIcon, setActiveIcon] = useState('default');

  useEffect(() => {
    getIcon()
      .then((icon) => {
        if (!icon || icon === 'Default' || icon === 'MainActivityDefault') {
          setActiveIcon('default');
        } else {
          const variant = ICON_VARIANTS.find(
            (v) => v.aliasName === icon || v.id === icon.replace('MainAcivity', '').toLowerCase()
          );
          setActiveIcon(variant?.id ?? 'default');
        }
      })
      .catch(() => setActiveIcon('default'));
  }, []);

  const handleSelect = useCallback(
    async (variant: IconVariant) => {
      if (variant.id === activeIcon) return;

      try {
        await changeIcon(variant.aliasName);
        setActiveIcon(variant.id);
        Alert.alert('Icon Updated!', `Your app icon is now "${variant.label}".`);
      } catch (err) {
        Alert.alert('Error', 'Failed to change app icon. Please try again.');
      }
    },
    [activeIcon]
  );

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          { color: isDark ? '#9CA3AF' : '#6B7280' },
        ]}
      >
        APP ICON
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6' },
        ]}
      >
        <View style={styles.grid}>
          {ICON_VARIANTS.map((variant) => {
            const isActive = variant.id === activeIcon;
            return (
              <Pressable
                key={variant.id}
                style={styles.iconOption}
                onPress={() => handleSelect(variant)}
              >
                <View
                  style={[
                    styles.iconPreview,
                    {
                      borderColor: isActive ? '#E50914' : isDark ? '#333' : '#D1D5DB',
                      borderWidth: isActive ? 2.5 : 1.5,
                      backgroundColor: variant.bgColor,
                    },
                  ]}
                >
                  <Image
                    source={variant.image}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                  {isActive && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark-circle" size={20} color="#E50914" />
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.iconLabel,
                    {
                      color: isActive
                        ? isDark
                          ? '#FFFFFF'
                          : '#111827'
                        : isDark
                          ? '#9CA3AF'
                          : '#6B7280',
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {variant.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconOption: {
    alignItems: 'center',
    width: 72,
  },
  iconPreview: {
    width: 60,
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  iconImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  iconLabel: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
});

export const AppIconPicker = memo(AppIconPickerBase);

