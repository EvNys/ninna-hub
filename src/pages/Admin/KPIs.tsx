import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { BarChart3, Save, RefreshCw, Layers, TrendingUp, Handshake, Rocket, Info } from 'lucide-react';
import { motion } from 'motion/react';

const AdminKPIs = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    kpi1_label: 'Eventos Realizados',
    kpi1_value: '0',
    kpi2_label: 'Conexões Geradas',
    kpi2_value: '0',
    kpi3_label: 'Negócios em R$',
    kpi3_value: '0',
    kpi4_label: 'Startups Impactadas',
    kpi4_value: '0'
  });

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    setLoading(true);
    try {
      const kpiDoc = await getDoc(doc(db, 'kpis', 'main'));
      if (kpiDoc.exists()) {
        const data = kpiDoc.data();
        setFormData({
          kpi1_label: data.kpi1_label || 'Eventos Realizados',
          kpi1_value: data.kpi1_value || '0',
          kpi2_label: data.kpi2_label || 'Conexões Geradas',
          kpi2_value: data.kpi2_value || '0',
          kpi3_label: data.kpi3_label || 'Negócios em R$',
          kpi3_value: data.kpi3_value || '0',
          kpi4_label: data.kpi4_label || 'Startups Impactadas',
          kpi4_value: data.kpi4_value || '0'
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar KPIs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'kpis', 'main'), {
        ...formData,
        updatedAt: serverTimestamp()
      });
      toast.success('KPIs atualizados com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar KPIs');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500 animate-pulse font-black uppercase tracking-widest">
        Carregando indicadores...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black flex items-center gap-4 uppercase tracking-tighter italic text-gray-900">
          <BarChart3 className="text-brand-teal w-8 h-8" />
          Gestão de Métricas
        </h1>
        <p className="text-gray-500 font-medium mt-2">Atualize os números oficiais de impacto que aparecem na home do Portal.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-100 rounded-[40px] p-12 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* KPI 1 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título do Indicador 1</label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus-within:border-brand-teal transition-all shadow-sm">
                  <Layers className="w-5 h-5 text-brand-teal" />
                  <input 
                    type="text"
                    value={formData.kpi1_label}
                    onChange={e => setFormData({...formData, kpi1_label: e.target.value})}
                    placeholder="Ex: Eventos Realizados"
                    className="bg-transparent outline-none text-xs font-black uppercase tracking-widest w-full text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor do Indicador 1</label>
                <input 
                  type="text"
                  required 
                  value={formData.kpi1_value} 
                  onChange={e => setFormData({...formData, kpi1_value: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-6 text-5xl font-black text-gray-900 focus:outline-none focus:border-brand-teal transition-all tracking-tighter shadow-sm"
                />
              </div>
            </div>

            {/* KPI 2 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título do Indicador 2</label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus-within:border-brand-teal transition-all shadow-sm">
                  <Handshake className="w-5 h-5 text-brand-teal" />
                  <input 
                    type="text"
                    value={formData.kpi2_label}
                    onChange={e => setFormData({...formData, kpi2_label: e.target.value})}
                    placeholder="Ex: Conexões Geradas"
                    className="bg-transparent outline-none text-xs font-black uppercase tracking-widest w-full text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor do Indicador 2</label>
                <input 
                  type="text"
                  required 
                  value={formData.kpi2_value} 
                  onChange={e => setFormData({...formData, kpi2_value: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-6 text-5xl font-black text-gray-900 focus:outline-none focus:border-brand-teal transition-all tracking-tighter shadow-sm"
                />
              </div>
            </div>

            {/* KPI 3 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título do Indicador 3</label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus-within:border-brand-teal transition-all shadow-sm">
                  <TrendingUp className="w-5 h-5 text-brand-teal" />
                  <input 
                    type="text"
                    value={formData.kpi3_label}
                    onChange={e => setFormData({...formData, kpi3_label: e.target.value})}
                    placeholder="Ex: Negócios em R$"
                    className="bg-transparent outline-none text-xs font-black uppercase tracking-widest w-full text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor do Indicador 3</label>
                <input 
                  type="text"
                  required 
                  value={formData.kpi3_value} 
                  onChange={e => setFormData({...formData, kpi3_value: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-6 text-5xl font-black text-gray-900 focus:outline-none focus:border-brand-teal transition-all tracking-tighter shadow-sm"
                />
              </div>
            </div>

            {/* KPI 4 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título do Indicador 4</label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus-within:border-brand-teal transition-all shadow-sm">
                  <Rocket className="w-5 h-5 text-brand-teal" />
                  <input 
                    type="text"
                    value={formData.kpi4_label}
                    onChange={e => setFormData({...formData, kpi4_label: e.target.value})}
                    placeholder="Ex: Startups Impactadas"
                    className="bg-transparent outline-none text-xs font-black uppercase tracking-widest w-full text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor do Indicador 4</label>
                <input 
                  type="text"
                  required 
                  value={formData.kpi4_value} 
                  onChange={e => setFormData({...formData, kpi4_value: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-6 text-5xl font-black text-gray-900 focus:outline-none focus:border-brand-teal transition-all tracking-tighter shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <button 
              type="button" 
              onClick={fetchKPIs}
              className="flex items-center gap-3 text-gray-400 hover:text-brand-teal transition-all text-[10px] font-black uppercase tracking-widest italic"
            >
              <RefreshCw className="w-4 h-4" /> Reverter Alterações
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className={`
                bg-brand-teal text-white font-black uppercase text-xs tracking-[0.2em] px-14 py-6 rounded-2xl transition-all shadow-xl shadow-brand-teal/20
                ${saving ? 'opacity-50 cursor-wait' : 'hover:scale-105 active:scale-95'}
              `}
            >
              {saving ? 'Publicando...' : 'Atualizar Portal'}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="mt-12 p-10 rounded-[40px] bg-white border border-gray-100 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-brand-teal opacity-50" />
        <h4 className="text-gray-900 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-3 italic">
          <Info className="w-5 h-5 text-brand-teal" />
          Nota Importante
        </h4>
        <p className="text-gray-500 text-sm font-medium leading-relaxed group-hover:text-gray-600 transition-colors">
          Estes indicadores são fundamentais para o posicionamento do NINNA Hub frente aos mantenedores e startups. Certifique-se de validar os números antes de salvar as alterações, pois a atualização no site público é instantânea.
        </p>
      </div>
    </div>
  );
};

export default AdminKPIs;
