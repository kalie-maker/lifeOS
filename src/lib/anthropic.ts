import Anthropic from "@anthropic-ai/sdk";
import type {
  CaptureEntity,
  CaptureResult,
  EntityType,
  SpaceKey,
} from "./entities";

/**
 * LifeOS capture engine. Free text in → structured entities out.
 * Server-only: the API key never reaches the client.
 */

export class CaptureError extends Error {
  constructor(
    public code: "no_api_key" | "refusal" | "parse" | "api",
    message: string,
  ) {
    super(message);
    this.name = "CaptureError";
  }
}

const ENTITY_TYPES: EntityType[] = ["reminder", "event", "asset", "note"];
const SPACE_KEYS: SpaceKey[] = [
  "car",
  "home",
  "pet",
  "family",
  "person",
  "general",
];

function buildSystemPrompt(now: Date): string {
  const iso = now.toISOString().slice(0, 10);
  const human = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(now);

  return [
    "Eres el motor de extracción de LifeOS. El usuario te habla en texto libre",
    "sobre su vida. Tu trabajo es extraer entidades estructuradas en JSON.",
    "",
    "Responde SOLO con JSON válido, sin texto adicional, sin markdown, sin",
    "explicaciones y sin vallas de código (```).",
    "",
    "Formato de respuesta EXACTO:",
    "{",
    '  "entities": [',
    "    {",
    '      "type": "reminder|event|asset|note",',
    '      "space": "car|home|pet|family|person|general",',
    '      "title": "título corto",',
    '      "description": "descripción breve",',
    '      "date": "YYYY-MM-DD o null",',
    '      "expiry_date": "YYYY-MM-DD o null",',
    '      "tags": ["tag1", "tag2"]',
    "    }",
    "  ],",
    '  "summary": "frase corta de lo que entendiste",',
    '  "pending_questions": ["pregunta si falta info importante"]',
    "}",
    "",
    "Tipos: reminder (algo que recordar o que vence), event (cita con fecha/hora),",
    "asset (un bien o dato persistente: coche, mascota, electrodoméstico),",
    "note (información general sin fecha).",
    "Espacios: car (coche/moto), home (casa, facturas), pet (mascotas),",
    "family (familia, colegio), person (bienestar, salud propia), general (lo demás).",
    "",
    `Fecha actual: ${iso} (${human}, zona horaria Europe/Madrid).`,
    "Resuelve las fechas relativas respecto a esta fecha y devuélvelas como",
    "YYYY-MM-DD. Usa null cuando no haya fecha. Si dan un mes sin año, usa la",
    "próxima ocurrencia futura. 'date' es cuándo ocurre algo; 'expiry_date' es",
    "cuándo vence o caduca. Escribe en español, tono formal (trato de usted).",
    "En pending_questions formula preguntas solo si falta información realmente",
    "importante; si no falta nada, deja la lista vacía [].",
  ].join("\n");
}

/** Extract a JSON object from the model's text, tolerating code fences. */
function parseJsonObject(raw: string): unknown {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    s = s.slice(first, last + 1);
  }
  return JSON.parse(s);
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function asNullableDate(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t || t.toLowerCase() === "null") return null;
  return t;
}

function normalizeEntity(raw: unknown): CaptureEntity | null {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  const type = ENTITY_TYPES.includes(e.type as EntityType)
    ? (e.type as EntityType)
    : "note";
  const space = SPACE_KEYS.includes(e.space as SpaceKey)
    ? (e.space as SpaceKey)
    : "general";
  const title = asString(e.title).trim();
  if (!title) return null;
  return {
    type,
    space,
    title,
    description: asString(e.description).trim(),
    date: asNullableDate(e.date),
    expiry_date: asNullableDate(e.expiry_date),
    tags: Array.isArray(e.tags)
      ? e.tags.filter((t): t is string => typeof t === "string")
      : [],
  };
}

function normalizeResult(parsed: unknown): CaptureResult {
  const obj = (parsed ?? {}) as Record<string, unknown>;
  const entities = Array.isArray(obj.entities)
    ? obj.entities.map(normalizeEntity).filter((e): e is CaptureEntity => !!e)
    : [];
  return {
    entities,
    summary: asString(obj.summary),
    pending_questions: Array.isArray(obj.pending_questions)
      ? obj.pending_questions.filter((q): q is string => typeof q === "string")
      : [],
  };
}

export async function extractEntities(text: string): Promise<CaptureResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new CaptureError(
      "no_api_key",
      "Falta la variable de entorno ANTHROPIC_API_KEY en el servidor.",
    );
  }

  const client = new Anthropic();

  let response: Anthropic.Message;
  try {
    response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      thinking: { type: "disabled" },
      system: buildSystemPrompt(new Date()),
      messages: [{ role: "user", content: text }],
    });
  } catch (err) {
    // Surface the exact API error so it's visible in logs and the response.
    const detail =
      err instanceof Anthropic.APIError
        ? err.message
        : err instanceof Error
          ? err.message
          : String(err);
    console.error("[/api/capture] Anthropic error:", detail);
    throw new CaptureError("api", `Error de la API de Claude: ${detail}`);
  }

  if (response.stop_reason === "refusal") {
    throw new CaptureError(
      "refusal",
      "LifeOS no ha podido procesar este texto. Pruebe a reformularlo.",
    );
  }

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";

  try {
    return normalizeResult(parseJsonObject(raw));
  } catch (err) {
    console.error(
      "[/api/capture] No se pudo parsear la respuesta:",
      raw.slice(0, 500),
      err,
    );
    throw new CaptureError(
      "parse",
      "La respuesta de LifeOS no se pudo interpretar. Inténtelo de nuevo.",
    );
  }
}
