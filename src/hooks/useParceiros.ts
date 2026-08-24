// hooks/useParceiros.ts
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'
import { PARCEIROS_FALLBACK } from '../data/parceiros-fallback';

export function useParceiros() {
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchParceiros() {
      try {
        const parceirosQuery = query(collection(db, 'parceiros'), where('status', '==', 'ativo'));
        const parceirosSnap = await getDocs(parceirosQuery);
        const dbParceiros = parceirosSnap.docs.map(doc => {
          const data = doc.data();
          let logoUrl = data.logo;

          if (
            (data.nome && data.nome.toLowerCase().includes('igc')) ||
            (data.logo && data.logo.toLowerCase().includes('igc'))
          ) {
            logoUrl = '../Imagens_NINNA/IGCLogo.png';
          } else if (
            (data.nome && data.nome.toLowerCase().includes('uece')) ||
            (data.logo && data.logo.toLowerCase().includes('uece'))
          ) {
            logoUrl = '../Imagens_NINNA/Uece.png';
          }
          return { id: doc.id, ...data, logo: logoUrl } as any;
        });

        const backupParceiros = PARCEIROS_FALLBACK;
        const combined = [...dbParceiros] as any[];

        backupParceiros.forEach((backup: { nome: string; logo: any; }) => {
          const matchedIndex = combined.findIndex(c => {
            const nameLower = c.nome?.toLowerCase() || '';
            const backupLower = backup.nome.toLowerCase();
            if (backupLower === 'uece' || backupLower.includes('uece')) {
              return nameLower.includes('uece') || nameLower.includes('universidade estadual');
            }
            if (backupLower.includes('gestão') || backupLower === 'igc') {
              return nameLower.includes('igc') || nameLower.includes('gestão e cidadania') || nameLower.includes('gestao e cidadania');
            }
            return nameLower === backupLower;
          });

          if (matchedIndex === -1) {
            combined.push(backup);
          } else {
            combined[matchedIndex].logo = backup.logo;
          }
        });

        const finalPartners: any[] = [];
        const seen = new Set<string>();

        combined.forEach(partner => {
          const nameLower = partner.nome?.toLowerCase() || '';
          let groupKey = nameLower;

          if (nameLower.includes('uece') || nameLower.includes('universidade estadual')) {
            groupKey = 'uece';
            partner.nome = 'UECE';
            partner.logo = '../Imagens_NINNA/Uece.png';
          } else if (nameLower.includes('igc') || nameLower.includes('gestão e cidadania') || nameLower.includes('gestao e cidadania')) {
            groupKey = 'igc';
            partner.nome = 'Instituto de Gestão e Cidadania';
            partner.logo = '../Imagens_NINNA/IGCLogo.png';
          }

          if (partner.nome === 'IGC') return;

          if (!seen.has(groupKey)) {
            seen.add(groupKey);
            finalPartners.push(partner);
          }
        });

        if (mounted) setParceiros(finalPartners);
      } catch (err) {
        console.error('Erro ao buscar parceiros:', err);
        if (mounted) setParceiros(PARCEIROS_FALLBACK);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchParceiros();
    return () => { mounted = false; };
  }, []);

  return { parceiros, loading };
}