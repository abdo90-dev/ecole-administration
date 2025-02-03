import React from 'react';
import Sidebar from '../components/Sidebar';
import { User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Profile() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="flex">
      <Sidebar />
      <main className={`ml-64 flex-1 p-8 mt-16 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-lg shadow-md overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="bg-gray-800 p-6 text-center">
              <div className="inline-block p-4 rounded-full bg-gray-700 mb-4">
                <User size={64} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">John Doe</h1>
              <p className="text-gray-300">user@example.com</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>{t('email')}</label>
                  <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    user@example.com
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>{t('role')}</label>
                  <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {t('administrator')}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>{t('memberSince')}</label>
                  <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    1 Janvier 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}