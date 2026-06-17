import Anthropic from "@anthropic-ai/sdk";
import type { CaptureResult } from "./entities";

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

// Structured-outputs schema — guarantees the exact JSON shape (no prefill,
// which Sonnet 4.6 rejects).
const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    entities: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: { type: "string", enum: ["reminder", "event", "asset", "note"] },
          space: {
            type: "string",
            enum: ["car", "home", "pet", "family", "person", "general"],
          },
          title: { type: "string" },
          description: { type: "string" },
          date: { anyOf: [{ type: "string" }, { type: "null" }] },
          expiry_date: { anyOf: [{ type: "string" }, { type: "null" }] },
          tags: { type: "array", items: { type: "string" } },
        },
        required: [
          "type",
          "space",
          "title",
          "description",
          "date",
          "expiry_date",
          "tags",
        ],
      },
    },
    summary: { type: "string" },
    pending_questions: { type: "array", items: { type: "string" } },
  },
  required: ["entities", "summary", "pending_questions"],
} as const;

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
    "sobre su vida. Tu trabajo es extraer entidades estructuradas.",
    "",
    "Tipos de entidad:",
    "- reminder: algo que recordar o que vence (ITV, pagos, renovaciones).",
    "- event: una cita con fecha/hora (médico, reunión, cumpleaños).",
    "- asset: un bien o dato persistente (un coche, una mascota, un electrodoméstico).",
    "- note: una nota o información general sin fecha.",
    "",
    "Espacios: car (coche/moto), home (casa, facturas, hogar), pet (mascotas),",
    "family (familia, colegio), person (bienestar, salud propia), general (lo demás).",
    "",
    `Fecha actual: ${iso} (${human}, zona horaria Europe/Madrid).`,
    "Resuelve las fechas relativas respecto a esta fecha y devuélvelas en formato",
    "YYYY-MM-DD. Usa null cuando no haya fecha. Si el usuario da un mes sin año,",
    "elige la próxima ocurrencia futura. 'date' es cuándo ocurre algo; 'expiry_date'",
    "es cuándo vence o caduca algo.",
    "",
    "Escribe títulos cortos y descripciones breves, en español y en tono formal",
    "(trato de usted). En pending_questions, formula preguntas solo cuando falte",
    "información realmente importante (por ejemplo, una matrícula o una fecha sin la",
    "que no puedas crear un recordatorio útil). Si no falta nada, deja la lista vacía.",
  ].join("\n");
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
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: RESPONSE_SCHEMA },
      },
      system: buildSystemPrompt(new Date()),
      messages: [{ role: "user", content: text }],
    });
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError
        ? `Error de la API de Claude (${err.status ?? "?"}).`
        : "No se pudo contactar con la API de Claude.";
    throw new CaptureError("api", message);
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
    const parsed = JSON.parse(raw) as CaptureResult;
    return {
      entities: Array.isArray(parsed.entities) ? parsed.entities : [],
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      pending_questions: Array.isArray(parsed.pending_questions)
        ? parsed.pending_questions
        : [],
    };
  } catch {
    throw new CaptureError(
      "parse",
      "La respuesta de LifeOS no se pudo interpretar. Inténtelo de nuevo.",
    );
  }
}
