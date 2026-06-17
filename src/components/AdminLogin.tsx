import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ChevronLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import NinnaHubLogo from './NinnaLogo';

interface AdminLoginProps {
  onLoginSuccess: (email: string) => void;
  onClose: () => void;
}

const ADMIN_CREDENTIALS: Record<string, string> = {
  [import.meta.env.VITE_ADMIN_EMAIL ?? '']: import.meta.env.VITE_ADMIN_PASSWORD ?? '',
};

export default function AdminLogin({ onLoginSuccess, onClose }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const expectedPassword = ADMIN_CREDENTIALS[cleanEmail];

      if (expectedPassword && password === expectedPassword) {
        onLoginSuccess(cleanEmail);
      } else {
        setErrorMsg('Credenciais incorretas. Verifique seu e-mail e senha.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex items-center justify-center p-4">
      {/* Decorative gradient background element */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl relative"
      >
        {/* Navigation bar inside card */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao Site</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold text-slate-600">Painel de Acesso</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="flex flex-col items-center gap-2 mb-2">
              <NinnaHubLogo light={false} scale={1.25} />
              <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded uppercase tracking-widest font-extrabold mt-3">
                Painel de Coordenação
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Consulte submissões registradas, emita pareceres de aptidão e exporte relatórios integrados.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                E-mail Administrativo
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-450">
                  <Mail className="w-4.5 h-4.5 text-slate-400" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-white border border-slate-350 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Senha de Acesso
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-450">
                  <Lock className="w-4.5 h-4.5 text-slate-400" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-slate-350 rounded-lg pl-10 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:shadow-md active:scale-98 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
