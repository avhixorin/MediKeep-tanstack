import { useCallback } from 'react';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';
import type { UserSettingsPreferences } from '@/types';

type PrefSection = keyof UserSettingsPreferences;

export function useSettings() {
  const { user } = useAuthStore();
  const { updateProfile } = useAuth();

  const prefs: UserSettingsPreferences = user?.settingPreferences ?? {};

  const updatePreference = useCallback(
    (section: PrefSection, patch: Record<string, unknown>) => {
      const current = prefs[section] ?? {};
      updateProfile({
        settingPreferences: {
          ...prefs,
          [section]: { ...current, ...patch },
        },
      });
    },
    [prefs, updateProfile]
  );

  return { user, prefs, updatePreference, updateProfile };
}
