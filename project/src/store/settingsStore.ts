import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type UserSettings = Database['public']['Tables']['user_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface SettingsState {
  settings: UserSettings | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  profile: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (error) throw error;
      set({ settings });
    } catch (error) {
      set({ error: 'Failed to fetch settings' });
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .single();

      if (error) throw error;
      set({ profile });
    } catch (error) {
      set({ error: 'Failed to fetch profile' });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (newSettings) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      set(state => ({
        settings: state.settings ? { ...state.settings, ...newSettings } : null
      }));
    } catch (error) {
      set({ error: 'Failed to update settings' });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (newProfile) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('profiles')
        .update(newProfile)
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      set(state => ({
        profile: state.profile ? { ...state.profile, ...newProfile } : null
      }));
    } catch (error) {
      set({ error: 'Failed to update profile' });
    } finally {
      set({ loading: false });
    }
  },
}));