import React, { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Startup } from '../../types';
import { Edit2, Trash2, Rocket, MapPin, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AdminPageHeader,
  AdminSearchBar,
  AdminFormModal,
  AdminEmptyState,
  AdminLoadingGrid,
  AdminFormFooter,
  AdminCheckbox,
} from '../../components/admin';

const AdminStartups = () => {
  const { items: startups, loading, create, update, remove } = useFirestoreCollection<Startup>({
    collectionName: 'startups',
    orderByField: 'createdAt',
    orderDirection: 'desc',
    successLabels: {
      create: 'Startup cadastrada com sucesso',
      update: 'Startup atualizada com sucesso',
      delete: 'Startup excluída',
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricaoCurta: '',
    descricaoCompleta: '',
    categoria: 'FinTech',
    estagio: 'Ideação',
    tipoNegocio: 'B2B',
    logo: '',
    site: '',
    cidade: '',
    estado: '',
    order: 0,
    statusVitrine: 'ativo',
    status: 'ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStartup) {
      await update(editingStartup.id, formData);
    } else {
      await create(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    remove(id, 'Tem certeza que deseja excluir esta startup?');
  };

  const openEdit = (startup: Startup) => {
    setEditingStartup(startup);
    setFormData({
      nome: startup.nome,
      descricaoCurta: startup.descricaoCurta,
      descricaoCompleta: startup.descricaoCompleta || '',
      categoria: startup.categoria || 'FinTech',
      estagio: startup.estagio || 'Ideação',
      tipoNegocio: startup.tipoNegocio || 'B2B',
      logo: startup.logo || '',
      site: startup.site || '',
      cidade: startup.cidade || '',
      estado: startup.estado || '',
      order: startup.order || 0,
      statusVitrine: startup.statusVitrine || '',
      status: startup.status
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingStartup(null);
    setFormData({
      nome: '',
      descricaoCurta: '',
      descricaoCompleta: '',
      categoria: 'FinTech',
      estagio: 'Ideação',
      tipoNegocio: 'B2B',
      logo: '',
      site: '',
      cidade: '',
      estado: '',
      order: 0,
      statusVitrine: '',
      status: 'ativo'
    });
  };

  const filteredStartups = startups.filter(s =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<Rocket className="text-brand-teal w-8 h-8" />}
        title="Portfólio de Startups"
        subtitle="Gerencie as empresas que compõem o ecossistema do Hub."
        addButtonLabel="Nova Startup"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
      />

      <AdminSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por nome ou categoria..."
      />

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingStartup ? 'Editar' : 'Cadastrar'} Startup`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Startup</label>
              <input type="text" placeholder="Ex: NINNA Cloud, BioTech..." required value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
              <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 appearance-none shadow-sm cursor-pointer">
                <option value="Agritech">Agritech</option><option value="FoodTech">FoodTech</option>
                <option value="HealthTech">HealthTech</option><option value="MedTech">MedTech</option>
                <option value="BioTech">BioTech</option><option value="FinTech">FinTech</option>
                <option value="InsurTech">InsurTech</option><option value="PropTech">PropTech</option>
                <option value="Construtech">Construtech</option><option value="RetailTech">RetailTech</option>
                <option value="E-commerce Tech">E-commerce Tech</option><option value="LogTech">LogTech</option>
                <option value="MobilityTech">MobilityTech</option><option value="AutoTech">AutoTech</option>
                <option value="EnergyTech">EnergyTech</option><option value="ClimateTech">ClimateTech</option>
                <option value="CleanTech">CleanTech</option><option value="GovTech">GovTech</option>
                <option value="RegTech">RegTech</option><option value="LegalTech">LegalTech</option>
                <option value="EdTech">EdTech</option><option value="HRTech">HRTech</option>
                <option value="WorkTech">WorkTech</option><option value="Martech">Martech</option>
                <option value="AdTech">AdTech</option><option value="SalesTech">SalesTech</option>
                <option value="Customer Experience (CX Tech)">Customer Experience (CX Tech)</option>
                <option value="TravelTech">TravelTech</option><option value="HospitalityTech">HospitalityTech</option>
                <option value="SportTech">SportTech</option><option value="GameTech">GameTech</option>
                <option value="MediaTech">MediaTech</option><option value="CreatorTech">CreatorTech</option>
                <option value="FashionTech">FashionTech</option><option value="BeautyTech">BeautyTech</option>
                <option value="PetTech">PetTech</option>
                <option value="AgFinTech">AgFinTech (interseção Agro + Financeiro)</option>
                <option value="SpaceTech">SpaceTech</option><option value="OceanTech">OceanTech</option>
                <option value="MiningTech">MiningTech</option>
                <option value="IndustryTech (IndTech)">IndustryTech (IndTech)</option>
                <option value="ManufacturingTech">ManufacturingTech</option>
                <option value="SupplyChainTech">SupplyChainTech</option>
                <option value="Cybersecurity (CyberTech)">Cybersecurity (CyberTech)</option>
                <option value="DataTech">DataTech</option><option value="AI Tech">AI Tech</option>
                <option value="Blockchain / Web3 Tech">Blockchain / Web3 Tech</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Maturidade (Estágio)</label>
              <select value={formData.estagio} onChange={e => setFormData({...formData, estagio: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 appearance-none shadow-sm cursor-pointer">
                <option value="Ideação">Ideação</option><option value="Validação">Validação</option>
                <option value="Operação">Operação</option><option value="Tração">Tração</option>
                <option value="Scale-up">Scale-up</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Negócio</label>
              <select value={formData.tipoNegocio} onChange={e => setFormData({...formData, tipoNegocio: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 appearance-none shadow-sm cursor-pointer">
                <option value="B2B">B2B</option><option value="B2C">B2C</option>
                <option value="B2B2C">B2B2C</option><option value="B2G">B2G</option>
                <option value="SaaS">SaaS</option><option value="Marketplace">Marketplace</option>
                <option value="Hardware">Hardware</option><option value="Outros">Outros</option>
              </select>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Curta (Pitch)</label>
              <input type="text" placeholder="Resuma a solução em uma frase impactante..." required value={formData.descricaoCurta}
                onChange={e => setFormData({...formData, descricaoCurta: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Completa</label>
              <textarea placeholder="Fale mais sobre o produto, mercado e impacto..." rows={4} value={formData.descricaoCompleta}
                onChange={e => setFormData({...formData, descricaoCompleta: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 resize-none shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL do Logo</label>
              <div className="relative">
                <Rocket className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="https://..." value={formData.logo}
                  onChange={e => setFormData({...formData, logo: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="https://..." value={formData.site}
                  onChange={e => setFormData({...formData, site: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cidade</label>
              <input type="text" placeholder="Ex: Fortaleza" value={formData.cidade}
                onChange={e => setFormData({...formData, cidade: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado</label>
              <input type="text" placeholder="CE" value={formData.estado}
                onChange={e => setFormData({...formData, estado: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Order</label>
              <input type="number" placeholder="0" value={formData.order}
                onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="flex items-center space-x-6 col-span-2 p-2">
              <AdminCheckbox
                checked={formData.status === 'ativo'}
                onToggle={() => setFormData({...formData, status: formData.status === 'ativo' ? 'inativo' : 'ativo'})}
                label="Startup Ativa no Portfólio"
              />
            </div>

            <div className="flex items-center space-x-6 col-span-2 p-2">
              <AdminCheckbox
                checked={formData.statusVitrine === 'ativo'}
                onToggle={() => setFormData({...formData, statusVitrine: formData.statusVitrine === 'ativo' ? 'inativo' : 'ativo'})}
                label="Startup Ativa na Vitrine"
              />
            </div>
          </div>

          <AdminFormFooter
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={editingStartup ? 'Salvar Alterações' : 'Cadastrar Startup'}
          />
        </form>
      </AdminFormModal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <AdminLoadingGrid count={6} height="h-64" />
        ) : filteredStartups.length === 0 ? (
          <AdminEmptyState
            icon={<Rocket className="w-16 h-16 mb-6 opacity-20 text-brand-teal" />}
            message="Nenhuma startup encontrada"
          />
        ) : (
          filteredStartups.map(item => (
            <motion.div layout key={item.id}
              className="bg-white p-10 flex flex-col group border border-gray-100 rounded-[40px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-4 shadow-inner overflow-hidden">
                  {item.logo ? (
                    <img src={item.logo} alt={item.nome} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <Rocket className="w-10 h-10 text-gray-200" />
                  )}
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => openEdit(item)} className="p-3 bg-gray-50 hover:bg-brand-teal text-gray-400 hover:text-white rounded-2xl shadow-sm transition-all">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-gray-50 hover:bg-red-500 text-gray-400 hover:text-white rounded-2xl shadow-sm transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-wide italic mb-3 leading-none">{item.nome}</h3>
              <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">{item.descricaoCurta}</p>

              <div className="flex items-center justify-between mt-auto pt-8 border-t border-gray-100">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em]">{item.categoria}</span>
                    <span className="text-[8px] font-black bg-gray-900/5 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">{item.tipoNegocio || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest gap-1 italic">
                      <MapPin className="w-3 h-3" />{item.cidade}, {item.estado}
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic ml-2 border-l border-gray-100 pl-2">{item.estagio}</span>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${item.status === 'ativo' ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                  {item.status}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStartups;
