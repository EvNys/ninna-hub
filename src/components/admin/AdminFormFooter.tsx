import React from 'react';
import { Save } from 'lucide-react';

interface AdminFormFooterProps {
  onCancel: () => void;
  submitLabel: string;
}

const AdminFormFooter = ({ onCancel, submitLabel }: AdminFormFooterProps) => (
  <div className="flex gap-4 pt-4">
    <button
      type="button"
      onClick={onCancel}
      className="flex-1 px-8 py-4 rounded-2xl border border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="flex-1 bg-brand-teal text-white font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-brand-teal/20"
    >
      <Save className="w-4 h-4 inline-block mr-2" />
      {submitLabel}
    </button>
  </div>
);

export default AdminFormFooter;
