import React from 'react';
import { Search } from 'lucide-react';

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AdminSearchBar = ({ value, onChange, placeholder = 'Buscar...' }: AdminSearchBarProps) => (
  <div className="mb-8 relative">
    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white border border-gray-100 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-teal text-gray-900 font-black uppercase text-xs tracking-widest shadow-lg transition-all"
    />
  </div>
);

export default AdminSearchBar;
