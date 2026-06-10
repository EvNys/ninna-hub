/**
 * useFirestoreCollection — CRUD reutilizável para coleções do Firestore
 * =====================================================================
 *
 * Encapsula o padrão que era copiado em todas as páginas admin:
 * buscar lista, criar, atualizar e excluir documentos — já com loading,
 * mensagens de toast e tratamento de erro.
 *
 * COMO USAR (exemplo numa página admin):
 *
 *   const { items, loading, create, update, remove } =
 *     useFirestoreCollection<Startup>({
 *       collectionName: 'startups',
 *       orderByField: 'createdAt',
 *       orderDirection: 'desc',
 *       successLabels: {
 *         create: 'Startup cadastrada com sucesso',
 *         update: 'Startup atualizada com sucesso',
 *         delete: 'Startup excluída',
 *       },
 *     });
 *
 *   // criar / editar
 *   editingItem ? await update(editingItem.id, formData) : await create(formData);
 *   // excluir (mostra window.confirm)
 *   remove(id, 'Tem certeza que deseja excluir esta startup?');
 *
 * O hook NÃO altera a forma dos documentos: apenas injeta `createdAt` /
 * `updatedAt` automaticamente, exatamente como o código antigo fazia.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import type { BaseDoc } from '../types';

type OrderDirection = 'asc' | 'desc';

interface SuccessLabels {
  create?: string;
  update?: string;
  delete?: string;
}

interface UseFirestoreCollectionOptions {
  /** Nome da coleção no Firestore (ex: 'startups'). */
  collectionName: string;
  /** Campo usado para ordenar a lista (ex: 'createdAt', 'ordem', 'nome'). */
  orderByField?: string;
  /** Direção da ordenação. Padrão: 'desc'. */
  orderDirection?: OrderDirection;
  /** Mensagens de sucesso exibidas no toast após cada operação. */
  successLabels?: SuccessLabels;
}

interface UseFirestoreCollectionResult<T> {
  /** Documentos carregados da coleção. */
  items: T[];
  /** `true` enquanto a lista está sendo buscada. */
  loading: boolean;
  /** Recarrega a lista manualmente. */
  refetch: () => Promise<void>;
  /** Cria um documento novo (injeta createdAt/updatedAt). */
  create: (data: Record<string, unknown>) => Promise<void>;
  /** Atualiza um documento existente (injeta updatedAt). */
  update: (id: string, data: Record<string, unknown>) => Promise<void>;
  /** Exclui um documento. Se `confirmMessage` for passado, mostra window.confirm antes. */
  remove: (id: string, confirmMessage?: string) => Promise<void>;
}

/**
 * Converte um erro do Firestore em toast, sem deixar o throw subir até a UI.
 * `handleFirestoreError` faz o log estruturado e re-lança — por isso o try/catch.
 */
function reportError(
  error: unknown,
  operation: OperationType,
  collectionName: string,
  fallbackMessage: string,
) {
  try {
    handleFirestoreError(error, operation, collectionName);
  } catch {
    // O log já foi feito por handleFirestoreError; aqui só avisamos o usuário.
  }
  toast.error(fallbackMessage);
}

export function useFirestoreCollection<T extends BaseDoc>(
  options: UseFirestoreCollectionOptions,
): UseFirestoreCollectionResult<T> {
  const {
    collectionName,
    orderByField,
    orderDirection = 'desc',
    successLabels,
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const baseRef = collection(db, collectionName);
      const q = orderByField
        ? query(baseRef, orderBy(orderByField, orderDirection))
        : query(baseRef);
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as T,
      );
      setItems(data);
    } catch (error) {
      reportError(error, OperationType.LIST, collectionName, 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [collectionName, orderByField, orderDirection]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success(successLabels?.create ?? 'Registro criado com sucesso');
        await refetch();
      } catch (error) {
        reportError(error, OperationType.CREATE, collectionName, 'Erro ao salvar');
      }
    },
    [collectionName, successLabels, refetch],
  );

  const update = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      try {
        await updateDoc(doc(db, collectionName, id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        toast.success(successLabels?.update ?? 'Registro atualizado com sucesso');
        await refetch();
      } catch (error) {
        reportError(error, OperationType.UPDATE, collectionName, 'Erro ao salvar');
      }
    },
    [collectionName, successLabels, refetch],
  );

  const remove = useCallback(
    async (id: string, confirmMessage?: string) => {
      if (confirmMessage && !window.confirm(confirmMessage)) return;
      try {
        await deleteDoc(doc(db, collectionName, id));
        toast.success(successLabels?.delete ?? 'Registro excluído');
        await refetch();
      } catch (error) {
        reportError(error, OperationType.DELETE, collectionName, 'Erro ao excluir');
      }
    },
    [collectionName, successLabels, refetch],
  );

  return { items, loading, refetch, create, update, remove };
}
