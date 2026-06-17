"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  readEntities,
  writeEntities,
  toStored,
  type CaptureEntity,
  type StoredEntity,
} from "@/lib/entities";

interface EntitiesContextValue {
  entities: StoredEntity[];
  ready: boolean;
  /** Confirm and persist a batch of captured entities. */
  addEntities: (entities: CaptureEntity[]) => void;
  /** Dismiss / archive a stored entity. */
  remove: (id: string) => void;
}

const Ctx = createContext<EntitiesContextValue | null>(null);

export function EntitiesProvider({ children }: { children: ReactNode }) {
  const [entities, setEntities] = useState<StoredEntity[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntities(readEntities());
    setReady(true);
  }, []);

  const addEntities = useCallback((incoming: CaptureEntity[]) => {
    setEntities((prev) => {
      const next = [...toStored(incoming), ...prev];
      writeEntities(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setEntities((prev) => {
      const next = prev.filter((e) => e.id !== id);
      writeEntities(next);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ entities, ready, addEntities, remove }}>
      {children}
    </Ctx.Provider>
  );
}

export function useEntities(): EntitiesContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEntities must be used within EntitiesProvider");
  return ctx;
}
