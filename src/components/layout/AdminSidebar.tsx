import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Rocket, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Handshake, 
  Users, 
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Award,
  Home,
  UserRoundPlus,
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Gift, UserCircle, Eye, ShieldCheck } from 'lucide-react';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  external?: boolean;
  color?: string;
}

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { isAdmin, isEditor, userData } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Sessão encerrada');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Erro ao sair');
    }
  };

  const adminItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Rocket, label: 'Startups', path: '/admin/startups' },
    { icon: Users, label: 'Mentores', path: '/admin/mentores' },
    { icon: UserRoundPlus, label: 'Inscrição Mentores', path: '/admin/InscricaoMentores' },
    { icon: GraduationCap, label: 'Treinamentos', path: '/admin/treinamentos' },
    { icon: Gift, label: 'Benefícios', path: '/admin/beneficios' },
    { icon: FileText, label: 'Cases', path: '/admin/cases' },
    { icon: Award, label: 'Premiações', path: '/admin/premiacoes' },
    { icon: Users, label: 'Comunidade (Admin)', path: '/admin/usuarios' },
    { icon: Eye, label: 'Visualizar como Membro', path: '/dashboard/comunidade', color: 'text-brand-teal' },
  ];

  const memberItems: MenuItem[] = [
    { icon: Users, label: 'Comunidade', path: '/dashboard/comunidade' },
    { icon: GraduationCap, label: 'Treinamentos', path: '/dashboard/treinamentos' },
    { icon: Users, label: 'Mentores', path: '/dashboard/mentores' },
    { icon: Gift, label: 'Clube NINNA', path: 'https://www.google.com.br', external: true },
    { icon: UserCircle, label: 'Meu Perfil', path: '/dashboard/perfil' },
  ];

  // If Admin is in Dashboard, show a way back
  const isCurrentlyInDashboard = window.location.pathname.startsWith('/dashboard');
  
  const menuItems: MenuItem[] = isAdmin || isEditor 
    ? (isCurrentlyInDashboard ? [...memberItems, { icon: ShieldCheck, label: 'Voltar ao Admin', path: '/admin', color: 'text-brand-teal' }] : adminItems) 
    : memberItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 md:w-64 bg-white border-r border-gray-100 flex flex-col z-40 shadow-sm">
      <div className="p-4 md:p-8 border-b border-gray-100">
        <NavLink to={isAdmin || isEditor ? "/admin" : "/dashboard/comunidade"} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center shadow-lg shadow-brand-teal/20 shrink-0">
            <Rocket className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-wide uppercase text-gray-900 hidden md:block">NINNA <span className="text-brand-teal">HUB</span></span>
        </NavLink>
      </div>

      <nav className="flex-grow p-2 md:p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, idx) => {
          if (item.external) {
            return (
              <a
                key={item.label + idx}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-teal hover:bg-brand-teal/5 transition-all group"
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden md:block">{item.label}</span>
              </a>
            );
          }
          return (
            <NavLink
              key={item.path + idx}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group
                ${isActive 
                  ? 'bg-brand-teal text-white shadow-xl shadow-brand-teal/20' 
                  : `${item.color || 'text-gray-400'} hover:text-brand-teal hover:bg-brand-teal/5`}
              `}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden md:block">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2 md:p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Voltar para Home</span>
         </button>

      
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
