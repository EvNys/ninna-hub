import React from 'react';
import { Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  addButtonLabel: string;
  onAdd: () => void;
  extraActions?: React.ReactNode;
}

const AdminPageHeader = ({ icon, title, subtitle, addButtonLabel, onAdd, extraActions }: AdminPageHeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
    <div>
      <h1 className="text-4xl font-black flex items-center gap-4 uppercase tracking-tighter italic text-gray-900">
        {icon}
        {title}
      </h1>
      <p className="text-gray-500 font-medium mt-2">{subtitle}</p>
    </div>
    <div className="flex flex-wrap gap-4">
      {extraActions}
      <button
        onClick={onAdd}
        className="bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl py-4 px-8 font-black uppercase text-[10px] tracking-widest flex items-center justify-center transition-all shadow-xl shadow-brand-teal/20"
      >
        <Plus className="mr-2 w-5 h-5" /> {addButtonLabel}
      </button>
    </div>
  </div>
);

export default AdminPageHeader;
