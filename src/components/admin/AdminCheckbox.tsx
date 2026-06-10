import React from 'react';
import { Check } from 'lucide-react';

interface AdminCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
}

const AdminCheckbox = ({ checked, onToggle, label }: AdminCheckboxProps) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div
      onClick={onToggle}
      className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${checked ? 'bg-brand-teal border-brand-teal' : 'bg-gray-50 border-gray-200 group-hover:border-brand-teal'}`}
    >
      {checked && <Check className="text-white w-4 h-4" />}
    </div>
    <span className="text-[10px] font-black italic uppercase tracking-widest text-gray-500 group-hover:text-brand-teal transition-colors">{label}</span>
  </label>
);

export default AdminCheckbox;
