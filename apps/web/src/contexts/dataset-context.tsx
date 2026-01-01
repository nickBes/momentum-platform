"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Dataset } from "@momentum/schemas/ai";

interface DatasetContextValue {
  selectedDatasets: Dataset[];
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;
  clearDatasets: () => void;
  hasDataset: (id: string) => boolean;
}

const DatasetContext = createContext<DatasetContextValue | null>(null);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([]);

  const addDataset = useCallback((dataset: Dataset) => {
    setSelectedDatasets((prev) => {
      if (prev.some((d) => d.id === dataset.id)) {
        return prev;
      }
      return [...prev, dataset];
    });
  }, []);

  const removeDataset = useCallback((id: string) => {
    setSelectedDatasets((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const clearDatasets = useCallback(() => {
    setSelectedDatasets([]);
  }, []);

  const hasDataset = useCallback(
    (id: string) => selectedDatasets.some((d) => d.id === id),
    [selectedDatasets],
  );

  return (
    <DatasetContext.Provider
      value={{
        selectedDatasets,
        addDataset,
        removeDataset,
        clearDatasets,
        hasDataset,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDatasets() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error("useDatasets must be used within a DatasetProvider");
  }
  return context;
}
