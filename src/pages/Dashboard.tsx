import React from 'react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Users, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Sidebar />
      <main className={`ml-64 flex-1 p-8 mt-16 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-4xl mx-auto">
          {/* School Logo */}
          <div className="flex justify-center mb-12">
            <div className={`p-6 rounded-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <GraduationCap size={80} className="text-blue-500" />
            </div>
          </div>

          {/* Welcome Section */}
          <div className={`mb-12 p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg text-center`}>
            <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back
            </p>
            <div className={`mt-6 inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Calendar size={20} className="text-blue-500" />
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/users')}
              className={`flex items-center space-x-4 px-8 py-6 rounded-xl transition-all duration-300 
                ${theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'} 
                shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            >
              <div className="p-4 rounded-lg bg-blue-500">
                <Users size={32} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Add New Student</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Register a new student in the system
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}