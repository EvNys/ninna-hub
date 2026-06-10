import React from 'react';

interface AdminEmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

const AdminEmptyState = ({ icon, message }: AdminEmptyStateProps) => (
  <div className="col-span-full py-32 text-center text-gray-400 flex flex-col items-center bg-white rounded-[40px] border border-gray-100 shadow-xl">
    {icon}
    <span className="font-black uppercase tracking-widest text-sm italic">{message}</span>
  </div>
);

export default AdminEmptyState;
