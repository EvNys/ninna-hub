import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import Startups from './pages/Startups';
import Portfolio from './pages/Portfolio';
import Eventos from './pages/Eventos';
import AgendaEventos from './pages/AgendaEventos';
import Oportunidades from './pages/Oportunidades';
import Sobre from './pages/Sobre';
import Cases from './pages/Cases';
import Ninna4Startups from './pages/Ninna4Startups';
import Servicos from './pages/Servicos';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminStartups from './pages/Admin/Startups';
import AdminMentores from './pages/Admin/Mentores';
import AdminInscricoesMentores from './pages/Admin/InscricaoMentores';
import AdminBeneficios from './pages/Admin/Beneficios';
import AdminOportunidades from './pages/Admin/Oportunidades';
import AdminEventos from './pages/Admin/Eventos';
import AdminKPIs from './pages/Admin/KPIs';
import AdminParceiros from './pages/Admin/Parceiros';
import AdminPatrocinadores from './pages/Admin/Patrocinadores';
import AdminUsuarios from './pages/Admin/Usuarios';
import AdminEquipe from './pages/Admin/Equipe';
import AdminCases from './pages/Admin/Cases';
import AdminPremiacoes from './pages/Admin/Premiacoes';
import AdminTreinamentos from './pages/Admin/Treinamentos';
import AdminAulas from './pages/Admin/Aulas';

// Member Pages
import Profile from './pages/Profile';
import Comunidade from './pages/Comunidade';
import Treinamentos from './pages/Treinamentos';
import DashboardMentores from './pages/DashboardMentores';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-brand-darker text-white">Carregando...</div>;
  if (!user) return <Navigate to="/admin/login" />;

  return <>{children}</>;
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-brand-darker text-white">Carregando...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" />;

  return <>{children}</>;
};

import AdminLayout from './components/layout/AdminLayout';
import SejaUmMentor from './pages/SejaUmMentor';

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Show Navbar and Footer only on public routes */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="/dashboard/*" element={null} />
        <Route path="/seja-um-mentor/*" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/startups" element={<Startups />} />
          <Route path="/startups/portfolio" element={<Portfolio />} />
          <Route path="/startups/ninna-4-startups" element={<Ninna4Startups />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/ecossistema" element={<Eventos />} />
          <Route path="/agenda" element={<AgendaEventos />} />
          <Route path="/oportunidades" element={<Oportunidades />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/empresas" element={<Servicos />} />
          <Route path="/seja-um-mentor" element={<SejaUmMentor />} />
          {/* Admin & Member Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/startups" element={<AdminProtectedRoute><AdminLayout><AdminStartups /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/mentores" element={<AdminProtectedRoute><AdminLayout><AdminMentores /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/InscricaoMentores" element={<AdminProtectedRoute><AdminLayout><AdminInscricoesMentores /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/beneficios" element={<AdminProtectedRoute><AdminLayout><AdminBeneficios /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/oportunidades" element={<AdminProtectedRoute><AdminLayout><AdminOportunidades /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/eventos" element={<AdminProtectedRoute><AdminLayout><AdminEventos /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/kpis" element={<AdminProtectedRoute><AdminLayout><AdminKPIs /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/parceiros" element={<AdminProtectedRoute><AdminLayout><AdminParceiros /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/patrocinadores" element={<AdminProtectedRoute><AdminLayout><AdminPatrocinadores /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/usuarios" element={<AdminProtectedRoute><AdminLayout><AdminUsuarios /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/equipe" element={<AdminProtectedRoute><AdminLayout><AdminEquipe /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/cases" element={<AdminProtectedRoute><AdminLayout><AdminCases /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/premiacoes" element={<AdminProtectedRoute><AdminLayout><AdminPremiacoes /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/treinamentos" element={<AdminProtectedRoute><AdminLayout><AdminTreinamentos /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/treinamentos/:trainingId/aulas" element={<AdminProtectedRoute><AdminLayout><AdminAulas /></AdminLayout></AdminProtectedRoute>} />

          {/* Member Area Routes */}
          <Route path="/dashboard/comunidade" element={<ProtectedRoute><AdminLayout><Comunidade /></AdminLayout></ProtectedRoute>} />
          <Route path="/dashboard/perfil" element={<ProtectedRoute><AdminLayout><Profile /></AdminLayout></ProtectedRoute>} />
          <Route path="/dashboard/treinamentos" element={<ProtectedRoute><AdminLayout><Treinamentos /></AdminLayout></ProtectedRoute>} />
          <Route path="/dashboard/mentores" element={<ProtectedRoute><AdminLayout><DashboardMentores /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </main>

      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="/dashboard/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior // force instant scroll to avoid smooth-scroll delay transition artifacts
    });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
