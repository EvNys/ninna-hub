import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-teal"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      <AdminSidebar />
      <main className="flex-grow ml-16 md:ml-64 p-4 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
