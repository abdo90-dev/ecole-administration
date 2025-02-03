import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, User, GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar() {
  const location = useLocation();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`h-screen w-64 fixed left-0 top-0 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-gray-800 to-gray-700 text-white'
    }`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-white/10 rounded-lg">
            <GraduationCap size={24} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-bold">{t('dashboard')}</h2>
        </div>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
              isActive('/dashboard')
                ? 'bg-white/10 text-blue-400'
                : 'hover:bg-white/5 hover:text-blue-400'
            }`}
          >
            <Home size={20} />
            <span className="font-medium">{t('home')}</span>
          </Link>
          <Link
            to="/users"
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
              isActive('/users')
                ? 'bg-white/10 text-blue-400'
                : 'hover:bg-white/5 hover:text-blue-400'
            }`}
          >
            <Users size={20} />
            <span className="font-medium">{t('users')}</span>
          </Link>
          <Link
            to="/profile"
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
              isActive('/profile')
                ? 'bg-white/10 text-blue-400'
                : 'hover:bg-white/5 hover:text-blue-400'
            }`}
          >
            <User size={20} />
            <span className="font-medium">{t('profile')}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}