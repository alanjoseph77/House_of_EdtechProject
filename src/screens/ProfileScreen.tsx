import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { fetchProfile } from '../api/profileService';
import type { SettingsItem, UserProfile } from '../types/profile';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsRow } from '../components/profile/StatsRow';
import { SettingsSectionView } from '../components/profile/SettingsSectionView';
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton';
import { useTheme } from '../theme/ThemeContext';

export default function ProfileScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({});

  const effectiveToggleValues = useMemo(
    () => ({ ...toggleValues, 'dark-mode': isDark }),
    [toggleValues, isDark]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = useCallback(
    (id: string, value: boolean) => {
      if (id === 'dark-mode') {
        toggleTheme();
        return;
      }
      setToggleValues((prev) => ({ ...prev, [id]: value }));
    },
    [toggleTheme]
  );

  const handleItemPress = useCallback((item: SettingsItem) => {
    Alert.alert(item.label, 'This feature is coming soon.');
  }, []);

  const handleEditPress = useCallback(() => {
    Alert.alert('Edit Profile', 'This feature is coming soon.');
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive' },
    ]);
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-base px-6">
        <Text className="mb-4 text-base text-fg">Couldn't load your profile.</Text>
        <Button mode="contained" buttonColor="#E50914" onPress={load}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-base" showsVerticalScrollIndicator={false}>
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        membership={profile.membership}
        avatarUrl={profile.avatarUrl}
        onEditPress={handleEditPress}
      />

      <StatsRow stats={profile.stats} />

      {profile.settingsSections.map((section) => (
        <SettingsSectionView
          key={section.id}
          section={section}
          toggleValues={effectiveToggleValues}
          onToggle={handleToggle}
          onItemPress={handleItemPress}
        />
      ))}

      <View className="mx-4 mt-6">
        <Button mode="outlined" textColor="#ef4444" onPress={handleLogout} style={{ borderColor: '#ef4444' }}>
          Log Out
        </Button>
      </View>

      <Text className="mb-8 mt-4 text-center text-xs text-fg-faint">
        Version {profile.appVersion}
      </Text>
    </ScrollView>
  );
}
