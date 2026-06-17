"use client";

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type {
  AnalyzedDoc,
  AttentionItem,
  CalendarEntry,
  ModuleId,
  PersonaDay,
  SpaceData,
  SpaceId,
  Tab,
  ToastState,
  VisualProject,
} from "./types";
import { mockAttention } from "@/data/mock/attention";
import { mockCalendar } from "@/data/mock/calendar";
import { mockPersona } from "@/data/mock/persona";
import { mockSpaces, spaceOrder } from "@/data/mock/spaces";
import { mockLibrary, mockDocuments } from "@/data/mock/documents";
import { voiceResults } from "@/data/mock/captures";
import { photoScenarios } from "@/data/mock/captures";
import { TODAY_ISO } from "@/lib/dates";

// ── State shape ──────────────────────────────────────────────────────
interface DataState {
  onboarded: boolean;
  name: string;
  attention: AttentionItem[];
  resolvedAttention: string[];
  calendar: CalendarEntry[];
  spaces: Record<SpaceId, SpaceData>;
  library: AnalyzedDoc[];
  persona: PersonaDay[];
  toast: ToastState | null;
}

function emptySpace(id: SpaceId, name: string): SpaceData {
  return {
    id,
    name,
    status: "Sin elementos",
    load: "tranquilo",
    itemCount: 0,
    alertCount: 0,
    nextAction: "Capture su primera información",
    blurb: "Aún no hay nada aquí. Capture algo para empezar.",
    sectionTitles: [],
    sections: [],
    insights: [],
    projects: [],
  };
}

const emptySpaces: Record<SpaceId, SpaceData> = {
  casa: emptySpace("casa", "Casa"),
  coche: emptySpace("coche", "Coche"),
  mascotas: emptySpace("mascotas", "Mascotas"),
  familia: emptySpace("familia", "Familia"),
};

// Deep-ish clone so the demo can be reset cleanly.
function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function demoState(): DataState {
  return {
    onboarded: true,
    name: "Hugo",
    attention: clone(mockAttention),
    resolvedAttention: [],
    calendar: clone(mockCalendar),
    spaces: clone(mockSpaces),
    library: clone(mockLibrary),
    persona: clone(mockPersona),
    toast: null,
  };
}

function freshState(name = ""): DataState {
  return {
    onboarded: false,
    name,
    attention: [],
    resolvedAttention: [],
    calendar: [],
    spaces: clone(emptySpaces),
    library: [],
    persona: [],
    toast: null,
  };
}

// ── Actions ──────────────────────────────────────────────────────────
type Action =
  | { type: "RESET_NEW" }
  | { type: "LOAD_DEMO" }
  | { type: "COMPLETE_ONBOARDING"; name: string; firstCapture?: string }
  | { type: "TOAST"; toast: ToastState | null }
  | { type: "RESOLVE_ATTENTION"; id: string }
  | { type: "ADD_CALENDAR"; entries: CalendarEntry[] }
  | { type: "ADD_ATTENTION"; items: AttentionItem[] }
  | { type: "ADD_INSIGHT"; spaceId: SpaceId; insight: string }
  | { type: "ADD_PROJECT"; project: VisualProject }
  | { type: "ADD_LIBRARY"; doc: AnalyzedDoc }
  | { type: "ADD_PERSONA"; day: PersonaDay }
  | { type: "BUMP_SPACE"; spaceId: SpaceId; items?: number; alerts?: number };

let toastSeq = 1;

function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const ids = new Set(existing.map((e) => e.id));
  return [...incoming.filter((i) => !ids.has(i.id)), ...existing];
}

function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "RESET_NEW":
      return freshState();
    case "LOAD_DEMO":
      return demoState();
    case "COMPLETE_ONBOARDING": {
      const base = { ...state, onboarded: true, name: action.name };
      if (action.firstCapture && action.firstCapture.trim()) {
        const note: AttentionItem = {
          id: `cap-onboard-${Date.now()}`,
          severity: "info",
          title: "Nota inicial guardada",
          module: "General",
          description: action.firstCapture.trim().slice(0, 90),
          actionLabel: "Revisar",
        };
        return { ...base, attention: [note, ...base.attention] };
      }
      return base;
    }
    case "TOAST":
      return { ...state, toast: action.toast };
    case "RESOLVE_ATTENTION":
      return {
        ...state,
        resolvedAttention: [...state.resolvedAttention, action.id],
      };
    case "ADD_CALENDAR":
      return { ...state, calendar: mergeById(state.calendar, action.entries) };
    case "ADD_ATTENTION":
      return { ...state, attention: mergeById(state.attention, action.items) };
    case "ADD_INSIGHT": {
      const sp = state.spaces[action.spaceId];
      if (sp.insights.includes(action.insight)) return state;
      return {
        ...state,
        spaces: {
          ...state.spaces,
          [action.spaceId]: { ...sp, insights: [action.insight, ...sp.insights] },
        },
      };
    }
    case "ADD_PROJECT": {
      const sp = state.spaces[action.project.spaceId];
      if (sp.projects.some((p) => p.id === action.project.id)) return state;
      return {
        ...state,
        spaces: {
          ...state.spaces,
          [action.project.spaceId]: {
            ...sp,
            projects: [action.project, ...sp.projects],
            itemCount: sp.itemCount + 1,
          },
        },
      };
    }
    case "ADD_LIBRARY":
      return { ...state, library: mergeById(state.library, [action.doc]) };
    case "ADD_PERSONA": {
      const without = state.persona.filter((d) => d.date !== action.day.date);
      return { ...state, persona: [...without, action.day] };
    }
    case "BUMP_SPACE": {
      const sp = state.spaces[action.spaceId];
      return {
        ...state,
        spaces: {
          ...state.spaces,
          [action.spaceId]: {
            ...sp,
            itemCount: sp.itemCount + (action.items ?? 0),
            alertCount: sp.alertCount + (action.alerts ?? 0),
          },
        },
      };
    }
    default:
      return state;
  }
}

// ── Context value ────────────────────────────────────────────────────
interface AppContextValue extends DataState {
  visibleAttention: AttentionItem[];
  spacesList: SpaceData[];
  // navigation
  tab: Tab;
  setTab: (t: Tab) => void;
  spaceDetail: SpaceId | null;
  openSpace: (id: SpaceId) => void;
  closeSpace: () => void;
  assistant: { open: boolean; prompt?: string };
  openAssistant: (prompt?: string) => void;
  closeAssistant: () => void;
  profileOpen: boolean;
  setProfileOpen: (v: boolean) => void;
  // mutations
  showToast: (message: string, module?: ModuleId) => void;
  clearToast: () => void;
  resetNew: () => void;
  loadDemo: () => void;
  completeOnboarding: (name: string, firstCapture?: string) => void;
  resolveAttention: (item: AttentionItem) => void;
  applyVoiceCapture: () => void;
  applyDocumentCapture: (docId: string, keptIds: string[]) => void;
  applyPhotoCapture: (scenarioId: string) => void;
  registerPersona: (day: Omit<PersonaDay, "id">) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, demoState);

  const [tab, setTab] = useState<Tab>("inicio");
  const [spaceDetail, setSpaceDetail] = useState<SpaceId | null>(null);
  const [assistant, setAssistant] = useState<{ open: boolean; prompt?: string }>({
    open: false,
  });
  const [profileOpen, setProfileOpen] = useState(false);

  const showToast = useCallback((message: string, module?: ModuleId) => {
    const toast: ToastState = { id: toastSeq++, message, module };
    dispatch({ type: "TOAST", toast });
    window.setTimeout(() => {
      dispatch({ type: "TOAST", toast: null });
    }, 3200);
  }, []);

  const applyVoiceCapture = useCallback(() => {
    dispatch({
      type: "ADD_CALENDAR",
      entries: [
        {
          id: "cap-voice-hogar",
          date: "2027-03-01",
          type: "vencimiento",
          title: "Renovación del seguro del hogar (estimado)",
          module: "Casa",
        },
      ],
    });
    dispatch({
      type: "ADD_ATTENTION",
      items: [
        {
          id: "cap-voice-pend",
          severity: "info",
          title: "Datos pendientes de su captura",
          module: "General",
          description: "Falta la matrícula del coche y el nombre del perro.",
          actionLabel: "Completar",
        },
      ],
    });
    dispatch({
      type: "ADD_INSIGHT",
      spaceId: "casa",
      insight:
        "Ha registrado una lavadora nueva y un microondas de 8 años en su Espacio Casa.",
    });
    voiceResults
      .filter((r) => r.spaceId)
      .forEach((r) =>
        dispatch({ type: "BUMP_SPACE", spaceId: r.spaceId!, items: 1 }),
      );
    showToast("Añadido a Inicio, Calendario y Espacios", "coche");
  }, [showToast]);

  const applyDocumentCapture = useCallback(
    (docId: string, keptIds: string[]) => {
      const doc = mockDocuments.find((d) => d.id === docId);
      if (!doc) return;
      const keepReminder = keptIds.includes("recordatorio") && !!doc.reminder;
      if (doc.reminder && keepReminder) {
        dispatch({
          type: "ADD_CALENDAR",
          entries: [
            {
              id: `cap-doc-${doc.id}`,
              date: doc.reminder.date,
              type: "vencimiento",
              title: doc.reminder.title,
              module: doc.module,
            },
          ],
        });
      }
      const keptLabels = doc.keepOptions
        .filter((o) => keptIds.includes(o.id) && o.id !== "original")
        .map((o) => o.label);
      const libDoc: AnalyzedDoc = {
        id: `lib-${doc.id}`,
        name: doc.name,
        type: doc.analysis.type,
        module: doc.module,
        date: "17 jun 2026",
        summary: doc.analysis.fields
          .map((f) => `${f.label}: ${f.value}`)
          .join(" · "),
        saved: keptLabels.length ? keptLabels : ["Resumen del análisis"],
        originalKept: keptIds.includes("original"),
        reminderCreated: keepReminder,
      };
      dispatch({ type: "ADD_LIBRARY", doc: libDoc });
      if (doc.spaceId && keptIds.includes("resumen")) {
        dispatch({
          type: "ADD_INSIGHT",
          spaceId: doc.spaceId,
          insight: doc.analysis.review[0],
        });
      }
      showToast("Análisis guardado en su biblioteca", doc.spaceId);
    },
    [showToast],
  );

  const applyPhotoCapture = useCallback(
    (scenarioId: string) => {
      const sc = photoScenarios.find((s) => s.id === scenarioId);
      if (!sc) return;
      if (sc.createsProject) {
        const project: VisualProject = {
          id: `cap-photo-${sc.id}`,
          title: sc.id === "salon" ? "Salón · madera clara" : "Modificación elegante",
          spaceId: sc.spaceId,
          summary: sc.analysis[0],
          budget: sc.budget,
          palette: sc.palette,
        };
        dispatch({ type: "ADD_PROJECT", project });
        showToast(
          `Proyecto guardado en el Espacio ${sc.spaceId === "casa" ? "Casa" : "Coche"}`,
          sc.spaceId,
        );
      } else {
        dispatch({
          type: "ADD_INSIGHT",
          spaceId: sc.spaceId,
          insight:
            "Su microondas tiene 8 años: si empieza a fallar, sustituirlo suele compensar más que repararlo.",
        });
        dispatch({ type: "BUMP_SPACE", spaceId: sc.spaceId, items: 1 });
        showToast("Guardado en el Espacio Casa", sc.spaceId);
      }
    },
    [showToast],
  );

  const registerPersona = useCallback(
    (day: Omit<PersonaDay, "id">) => {
      dispatch({ type: "ADD_PERSONA", day: { ...day, id: `p-${day.date}` } });
      if (day.workout !== "ninguno") {
        const labels: Record<string, string> = {
          "tren-superior": "tren superior",
          pierna: "pierna",
          cardio: "cardio",
          "full-body": "full body",
          otro: "entreno",
        };
        dispatch({
          type: "ADD_CALENDAR",
          entries: [
            {
              id: `cap-persona-${day.date}`,
              date: day.date,
              type: "entreno",
              title: `Entreno: ${labels[day.workout] ?? "sesión"}`,
              module: "Persona",
            },
          ],
        });
      }
      showToast("Registrado en Persona y Calendario", "persona");
    },
    [showToast],
  );

  const resolveAttention = useCallback((item: AttentionItem) => {
    if (item.spaceId) {
      setSpaceDetail(item.spaceId);
    }
  }, []);

  const visibleAttention = state.attention
    .filter((a) => !state.resolvedAttention.includes(a.id))
    .sort((a, b) => {
      const rank = { danger: 0, warn: 1, info: 2 } as const;
      return rank[a.severity] - rank[b.severity];
    });

  const spacesList = spaceOrder.map((id) => state.spaces[id]);

  const value: AppContextValue = {
    ...state,
    visibleAttention,
    spacesList,
    tab,
    setTab,
    spaceDetail,
    openSpace: setSpaceDetail,
    closeSpace: () => setSpaceDetail(null),
    assistant,
    openAssistant: (prompt) => setAssistant({ open: true, prompt }),
    closeAssistant: () => setAssistant({ open: false }),
    profileOpen,
    setProfileOpen,
    showToast,
    clearToast: () => dispatch({ type: "TOAST", toast: null }),
    resetNew: () => dispatch({ type: "RESET_NEW" }),
    loadDemo: () => dispatch({ type: "LOAD_DEMO" }),
    completeOnboarding: (name, firstCapture) =>
      dispatch({ type: "COMPLETE_ONBOARDING", name, firstCapture }),
    resolveAttention,
    applyVoiceCapture,
    applyDocumentCapture,
    applyPhotoCapture,
    registerPersona,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { TODAY_ISO };
