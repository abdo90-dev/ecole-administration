import React from 'react';
import { LogOut, Home, Sun, Moon, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className={`fixed top-0 right-0 left-64 h-16 z-10 backdrop-blur-lg transition-colors
      ${theme === 'dark' 
        ? 'bg-gray-900/80 text-white border-b border-gray-700' 
        : 'bg-white/80 text-gray-700 border-b border-gray-200'}`}>
      <div className="h-full px-8 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
          <Home size={20} />
          <span className="font-medium">{t('home')}</span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Languages size={20} />
              <span className="font-medium">{language.toUpperCase()}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block">
              <button
                onClick={() => setLanguage('fr')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Français
              </button>
              <button
                onClick={() => setLanguage('en')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                العربية
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}