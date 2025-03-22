import React, { useEffect } from 'react';
import { Bell, Moon, Sun, Monitor, Shield, Mail } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

const Settings = () => {
  const { settings, loading, error, fetchSettings, updateSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    await updateSettings({ theme });
  };

  const handleNotificationChange = async (type: 'email' | 'push', value: boolean) => {
    if (settings) {
      const newPreferences = {
        ...settings.notification_preferences,
        [type]: value,
      };
      await updateSettings({ notification_preferences: newPreferences });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}

          {/* Theme Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Theme</h2>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
                  settings?.theme === 'light'
                    ? 'bg-purple-500 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-indigo-200 hover:bg-white/10'
                }`}
              >
                <Sun className="w-6 h-6" />
                <span>Light</span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
                  settings?.theme === 'dark'
                    ? 'bg-purple-500 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-indigo-200 hover:bg-white/10'
                }`}
              >
                <Moon className="w-6 h-6" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
                  settings?.theme === 'system'
                    ? 'bg-purple-500 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-indigo-200 hover:bg-white/10'
                }`}
              >
                <Monitor className="w-6 h-6" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-300" />
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-indigo-300 text-sm">Receive course updates via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.notification_preferences?.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-indigo-300" />
                  <div>
                    <h3 className="text-white font-medium">Push Notifications</h3>
                    <p className="text-indigo-300 text-sm">Get instant updates in your browser</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.notification_preferences?.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-300" />
                <div>
                  <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                  <p className="text-indigo-300 text-sm">Add an extra layer of security to your account</p>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;