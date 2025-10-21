'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserWeddings } from '@/lib/wedding-data-service';

interface Wedding {
  id: string;
  coupleNames: string[];
  weddingDate: string;
  status: string;
  overallProgress: number;
}

interface WeddingContextType {
  selectedWeddingId: string | null;
  weddings: Wedding[];
  isLoading: boolean;
  error: string | null;
  selectWedding: (weddingId: string) => void;
  refreshWeddings: () => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

interface WeddingProviderProps {
  children: ReactNode;
}

export function WeddingProvider({ children }: WeddingProviderProps) {
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(null);
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeddings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userWeddings = await getUserWeddings();
      setWeddings(userWeddings);
      
      // Auto-select first wedding if none selected
      if (userWeddings.length > 0 && !selectedWeddingId) {
        setSelectedWeddingId(userWeddings[0].id);
      }
    } catch (err) {
      console.error('Failed to load weddings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load weddings');
      setWeddings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeddings();
  }, []);

  const selectWedding = (weddingId: string) => {
    setSelectedWeddingId(weddingId);
    // Store in localStorage for persistence
    localStorage.setItem('selectedWeddingId', weddingId);
  };

  const refreshWeddings = async () => {
    await loadWeddings();
  };

  // Load selected wedding from localStorage on mount
  useEffect(() => {
    const storedWeddingId = localStorage.getItem('selectedWeddingId');
    if (storedWeddingId && weddings.some(w => w.id === storedWeddingId)) {
      setSelectedWeddingId(storedWeddingId);
    }
  }, [weddings]);

  const value: WeddingContextType = {
    selectedWeddingId,
    weddings,
    isLoading,
    error,
    selectWedding,
    refreshWeddings
  };

  return (
    <WeddingContext.Provider value={value}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (context === undefined) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}