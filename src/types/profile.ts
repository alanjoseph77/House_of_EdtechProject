export interface ProfileStat {
  id: string;
  label: string;
  value: number;
}

export interface SettingsItem {
  id: string;
  label: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'value';
  value?: string;
  defaultEnabled?: boolean;
}

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  membership: string;
  stats: ProfileStat[];
  settingsSections: SettingsSection[];
  appVersion: string;
}
