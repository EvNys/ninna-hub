import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';
import { User, Mail, Phone, Building2, Camera, Shield, Save, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

const Profile = () => {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    telefone: '',
    nomeEmpresa: '',
    foto: '',
    publico: true
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        telefone: userData.telefone || '',
        nomeEmpresa: userData.nomeEmpresa || '',
        foto: userData.foto || '',
        publico: userData.publico !== undefined ? userData.publico : true
      });
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Firestore Error:', JSON.stringify({
        error: error.message,
        operationType: 'write',
        path: `users/${user.uid}`,
        authInfo: {
          email: user.email,
          uid: user.uid
        }
      }));
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-brand-darker p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
            </div>
            
            <div className="relative z-10">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-[40px] bg-white p-1 shadow-2xl relative group overflow-hidden">
                  {formData.foto ? (
                    <img src={formData.foto} alt="Profile" className="w-full h-full object-cover rounded-[38px]" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                    <input 
                      type="text" 
                      className="hidden" 
                      onClick={(e) => {
                        e.preventDefault();
                        const url = window.prompt('Insira a URL da sua foto:', formData.foto);
                        if (url !== null) setFormData({...formData, foto: url});
                      }}
                    />
                  </label>
                </div>
              </div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic italic">{formData.name || 'Seu Nome'}</h1>
              <p className="text-brand-teal font-black text-[10px] uppercase tracking-[0.3em] mt-2">{userData?.role === 'admin' ? 'Administrador' : 'Membro da Comunidade'}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Startup / Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={formData.nomeEmpresa}
                    onChange={e => setFormData({...formData, nomeEmpresa: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={formData.telefone}
                    onChange={e => setFormData({...formData, telefone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (Somente Leitura)</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    type="text" 
                    value={userData?.email || ''}
                    readOnly
                    className="w-full bg-gray-100 border border-transparent rounded-2xl pl-14 pr-6 py-4 text-gray-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Foto de Perfil (URL)</label>
              <input 
                type="text" 
                value={formData.foto}
                onChange={e => setFormData({...formData, foto: e.target.value})}
                placeholder="https://exemplo.com/sua-foto.jpg"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal text-gray-900 font-medium"
              />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div 
                onClick={() => setFormData({...formData, publico: !formData.publico})}
                className={`p-6 rounded-[30px] border-2 cursor-pointer transition-all flex items-center justify-between ${formData.publico ? 'border-brand-teal bg-brand-teal/5' : 'border-gray-100 bg-gray-50 opacity-60'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.publico ? 'bg-brand-teal text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {formData.publico ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className={`font-black uppercase text-xs tracking-widest ${formData.publico ? 'text-gray-900' : 'text-gray-400'}`}>
                      {formData.publico ? 'Perfil Público na Comunidade' : 'Perfil Privado'}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tight">
                      {formData.publico ? 'Suas informações estão visíveis para outros membros conectados.' : 'Você não aparecerá na lista de membros da comunidade.'}
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.publico ? 'border-brand-teal' : 'border-gray-300'}`}>
                  {formData.publico && <div className="w-2 h-2 bg-brand-teal rounded-full" />}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-teal text-white font-black uppercase text-[10px] tracking-[0.2em] py-6 rounded-2xl shadow-2xl shadow-brand-teal/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Salvando Alterações...' : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Salvar Perfil
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
