import { NextResponse } from "next/server";
import { CaptureError, extractEntities } from "@/lib/anthropic";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Cuerpo de la petición no válido." },
      { status: 400 },
    );
  }

  const text =
    body && typeof (body as { text?: unknown }).text === "string"
      ? (body as { text: string }).text.trim()
      : "";

  if (!text) {
    return NextResponse.json(
      { error: "empty", message: "Escriba algo para que LifeOS lo procese." },
      { status: 400 },
    );
  }

  try {
    const result = await extractEntities(text);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CaptureError) {
      const status = err.code === "no_api_key" ? 500 : 502;
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status },
      );
    }
    return NextResponse.json(
      { error: "unknown", message: "Se ha producido un error inesperado." },
      { status: 500 },
    );
  }
}
