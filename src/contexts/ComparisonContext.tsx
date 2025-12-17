'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '@/types/property';

interface ComparisonContextType {
  comparisonProperties: Property[];
  addToComparison: (property: Property) => void;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('comparison-properties');
    if (saved) {
      try {
        setComparisonProperties(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading comparison properties:', error);
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('comparison-properties', JSON.stringify(comparisonProperties));
  }, [comparisonProperties]);

  const addToComparison = (property: Property) => {
    setComparisonProperties((prev) => {
      // Don't add if already in comparison
      if (prev.some((p) => p.id === property.id)) {
        return prev;
      }
      // Limit to 3 properties
      if (prev.length >= 3) {
        alert('You can only compare up to 3 properties at a time');
        return prev;
      }
      return [...prev, property];
    });
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const clearComparison = () => {
    setComparisonProperties([]);
  };

  const isInComparison = (propertyId: string) => {
    return comparisonProperties.some((p) => p.id === propertyId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProperties,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
