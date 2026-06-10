import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Rocket, Lock, Mail, ArrowRight, UserPlus, Chrome } from 'lucide-react';
import { motion } from 'motion/react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      toast.success('Login realizado com sucesso!');
      
      if (userData?.role === 'admin' || userData?.role === 'editor') {
        navigate('/admin');
      } else {
        navigate('/dashboard/comunidade');
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      let message = 'Erro ao realizar login.';
      if (error.code === 'auth/user-not-found') message = 'Usuário não encontrado.';
      else if (error.code === 'auth/wrong-password') message = 'Senha incorreta.';
      else if (error.code === 'auth/invalid-email') message = 'E-mail inválido.';
      else if (error.code === 'auth/operation-not-allowed') {
        message = 'O login por e-mail ainda não foi ativado no Console do Firebase. Por favor, ative-o em Authentication > Sign-in method.';
      }
      else message = `Erro (${error.code}): Verifique suas credenciais.`;
      
      toast.error(message, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 1. Try to find user by UID
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let existingData = userDoc.data();
      let role = existingData?.role;

      // 2. If not found by UID, check if there's a pending account by EMAIL
      if (!existingData) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', user.email?.toLowerCase()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const pendingDoc = querySnapshot.docs[0];
          const pendingData = pendingDoc.data();
          role = pendingData.role;
          
          // Migrate data to the new UID doc
          await setDoc(doc(db, 'users', user.uid), {
            ...pendingData,
            uid: user.uid,
            email: user.email,
            name: pendingData.name || user.displayName,
            updatedAt: new Date().toISOString(),
            pendingAuth: false
          });
          
          // Delete the pending record if IDs are different
          if (pendingDoc.id !== user.uid) {
            await deleteDoc(doc(db, 'users', pendingDoc.id));
          }
          
          existingData = { ...pendingData, uid: user.uid };
        }
      }

      const newRole = role || (user.email === 'ninnaventures@gmail.com' || user.email === 'adm@ninnahub.com.br' ? 'admin' : 'user');

      // 3. Final update/merge for current UID
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: newRole,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      toast.success('Login com Google realizado!');
      
      if (newRole === 'admin' || newRole === 'editor') {
        navigate('/admin');
      } else {
        navigate('/dashboard/comunidade');
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      toast.error('Erro ao autenticar com Google: ' + error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const setupAdmin = async () => {
    setCreating(true);
    const configs = [
      { email: 'adm@ninnahub.com.br', pass: '123456*' },
      { email: 'ninnaventures@gmail.com', pass: 'ninna2026' }
    ];

    try {
      for (const config of configs) {
        let uid = '';
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, config.email, config.pass);
          uid = userCredential.user.uid;
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            try {
              const loginRes = await signInWithEmailAndPassword(auth, config.email, config.pass);
              uid = loginRes.user.uid;
            } catch (loginError) {
              if (config.email === 'adm@ninnahub.com.br') {
                const loginRes = await signInWithEmailAndPassword(auth, config.email, '1123581321*Ninna');
                uid = loginRes.user.uid;
              }
            }
          }
        }

        if (uid) {
          await setDoc(doc(db, 'users', uid), {
            uid,
            email: config.email,
            role: 'admin',
            createdAt: new Date().toISOString()
          });
        }
      }

      toast.success('Contas de administrador configuradas/verificadas!');
      setEmail('ninnaventures@gmail.com');
      setPassword('ninna2026');
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao configurar sistema: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border border-gray-100 rounded-[40px] p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-teal/10 rounded-[32px] mb-8 group transition-all hover:rotate-6 hover:scale-105 shadow-sm border border-brand-teal/10">
            <Rocket className="text-brand-teal w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter italic text-gray-900 leading-none">NINNA <span className="text-brand-teal">HUB</span></h2>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] italic">Painel Administrativo CMS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                placeholder="admin@ninnahub.com.br"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white font-black uppercase text-[10px] tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-brand-teal/20 disabled:opacity-50 flex items-center justify-center group"
          >
            {loading ? 'Entrando...' : (
              <>
                Entrar com E-mail <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-[8px] uppercase">
              <span className="bg-white px-4 text-gray-400 font-black tracking-[0.5em] italic">ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full bg-white text-gray-700 border border-gray-100 py-5 rounded-2xl flex items-center justify-center font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
          >
            {googleLoading ? 'Conectando...' : (
              <>
                <Chrome className="mr-3 w-5 h-5 text-brand-teal" /> Entrar com Google
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 opacity-40 hover:opacity-100 transition-opacity">
          <button
            onClick={setupAdmin}
            disabled={creating}
            className="w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-gray-400 hover:text-brand-teal bg-gray-50 border border-transparent hover:border-brand-teal/30 disabled:opacity-50 italic"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            <span>{creating ? 'Resetando Acessos...' : 'Recuperar Acessos (Reset)'}</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">
            Acesso restrito a administradores autorizados.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
