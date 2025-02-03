import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    home: 'Accueil',
    users: 'Utilisateurs',
    profile: 'Profil',
    logout: 'Déconnexion',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    dashboard: 'Tableau de bord',
    welcome: 'Bienvenue',
    sidebarNavigation: 'Utilisez la barre latérale pour naviguer entre les différentes sections.',
    studentManagement: 'Gestion des Étudiants',
    search: 'Rechercher...',
    allClasses: 'Toutes les classes',
    allSpecialities: 'Toutes les spécialités',
    allYears: 'Toutes les années',
    studentId: 'N° Étudiant',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    class: 'Classe',
    speciality: 'Spécialité',
    year: 'Année',
    actions: 'Actions',
    previous: 'Précédent',
    next: 'Suivant',
    page: 'Page',
    of: 'sur',
    addStudent: 'Ajouter un étudiant',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet étudiant ?',
    memberSince: 'Membre depuis',
    role: 'Rôle',
    administrator: 'Administrateur'
  },
  en: {
    home: 'Home',
    users: 'Users',
    profile: 'Profile',
    logout: 'Logout',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    sidebarNavigation: 'Use the sidebar to navigate between different sections.',
    studentManagement: 'Student Management',
    search: 'Search...',
    allClasses: 'All classes',
    allSpecialities: 'All specialities',
    allYears: 'All years',
    studentId: 'Student ID',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    class: 'Class',
    speciality: 'Speciality',
    year: 'Year',
    actions: 'Actions',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    addStudent: 'Add student',
    deleteConfirm: 'Are you sure you want to delete this student?',
    memberSince: 'Member since',
    role: 'Role',
    administrator: 'Administrator'
  },
  ar: {
    home: 'الرئيسية',
    users: 'المستخدمين',
    profile: 'الملف الشخصي',
    logout: 'تسجيل خروج',
    darkMode: 'الوضع المظلم',
    lightMode: 'الوضع المضيء',
    dashboard: 'لوحة التحكم',
    welcome: 'مرحباً',
    sidebarNavigation: 'استخدم الشريط الجانبي للتنقل بين الأقسام المختلفة.',
    studentManagement: 'إدارة الطلاب',
    search: 'بحث...',
    allClasses: 'جميع الفصول',
    allSpecialities: 'جميع التخصصات',
    allYears: 'جميع السنوات',
    studentId: 'رقم الطالب',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    class: 'الفصل',
    speciality: 'التخصص',
    year: 'السنة',
    actions: 'الإجراءات',
    previous: 'السابق',
    next: 'التالي',
    page: 'صفحة',
    of: 'من',
    addStudent: 'إضافة طالب',
    deleteConfirm: 'هل أنت متأكد من حذف هذا الطالب؟',
    memberSince: 'عضو منذ',
    role: 'الدور',
    administrator: 'مدير'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}