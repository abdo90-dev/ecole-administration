import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../environment'; 
interface LoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Adresse email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 // Ensure this path is correct
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
  
    if (validateForm()) {
      try {
        // Use Firebase Authentication to sign in
        await signInWithEmailAndPassword(auth, email, password);
        onLogin({ email, password }); // Call onLogin if needed for additional logic
      } catch (error) {
        setErrors({
          general: 'Email ou mot de passe incorrect'
        });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl border border-gray-100">
          <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur">
                <Shield size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center">Administration</h2>
            <p className="text-center text-blue-100 mt-1">Gestion des étudiants</p>
          </div>

          <div className="p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: undefined, general: undefined });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  } focus:ring-4 focus:outline-none transition-colors`}
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: undefined, general: undefined });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  } focus:ring-4 focus:outline-none transition-colors`}
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium
                  hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 focus:outline-none
                  transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Identifiants de test : admin@example.com / password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}