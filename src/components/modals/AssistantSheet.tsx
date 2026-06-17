"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/state/AppContext";
import { Sheet } from "@/components/ui/Sheet";
import { Icon } from "@/components/ui/Icon";
import type { AssistantAnswer, AssistantMessage } from "@/state/types";
import { answerQuestion, assistantSuggestions } from "@/lib/assistant";

let seq = 1;

function AnswerBlock({ answer }: { answer: AssistantAnswer }) {
  return (
    <div className="space-y-3">
      <p className="text-base text-ink">{answer.summary}</p>
      {answer.bullets.length > 0 && (
        <ul className="space-y-1.5">
          {answer.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-2">
              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-3" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {answer.load && (
        <p className="text-sm font-medium text-warn">{answer.load}</p>
      )}
      <div className="flex items-start gap-2 rounded-xl bg-[color-mix(in_srgb,var(--color-accent)_7%,transparent)] px-3.5 py-3">
        <span className="mt-0.5 text-accent">
          <Icon name="sparkle" size={15} />
        </span>
        <p className="text-sm leading-relaxed text-ink">{answer.recommendation}</p>
      </div>
    </div>
  );
}

export function AssistantSheet() {
  const { assistant, closeAssistant, calendar, attention, persona } = useApp();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function ask(text: string) {
    const q = text.trim();
    if (!q) return;
    const userMsg: AssistantMessage = {
      id: `m-${seq++}`,
      role: "user",
      text: q,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      const answer = answerQuestion(q, { calendar, attention, persona });
      setMessages((m) => [
        ...m,
        { id: `m-${seq++}`, role: "assistant", text: answer.summary, answer },
      ]);
      setThinking(false);
    }, 650);
  }

  // On open: reset and, if a prompt was provided, answer it.
  useEffect(() => {
    if (!assistant.open) return;
    setMessages([]);
    setInput("");
    if (assistant.prompt) {
      const q = assistant.prompt;
      const answer = answerQuestion(q, { calendar, attention, persona });
      setMessages([
        { id: `m-${seq++}`, role: "user", text: q },
        { id: `m-${seq++}`, role: "assistant", text: answer.summary, answer },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistant.open, assistant.prompt]);

  // Keep scrolled to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  function simulateVoice() {
    setSpeaking(true);
    window.setTimeout(() => setSpeaking(false), 1800);
    if (messages.length === 0) ask("¿Qué tengo hoy?");
  }

  return (
    <Sheet
      open={assistant.open}
      onClose={closeAssistant}
      side="bottom"
      height="84%"
      title="LifeOS"
      headerRight={
        <span className="mr-1 flex items-center gap-1.5 text-xs text-ink-3">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          En línea
        </span>
      }
    >
      <div className="flex h-full flex-col">
        {/* Conversation */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-2">
          {messages.length === 0 && (
            <div className="los-fade-in py-2">
              <p className="text-base leading-relaxed text-ink-2">
                Soy LifeOS. Conozco su día, sus espacios y sus documentos.
                Pregúnteme lo que necesite.
              </p>
              <div className="mt-4 space-y-2">
                {assistantSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-left text-sm text-ink transition-colors hover:border-ink-3"
                  >
                    {s}
                    <Icon name="arrow-right" size={15} className="text-ink-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 py-2">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="los-rise max-w-[82%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-base text-white">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className="los-rise max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3.5">
                    {m.answer ? <AnswerBlock answer={m.answer} /> : m.text}
                  </div>
                </div>
              ),
            )}
            {thinking && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-ink-3"
                      style={{
                        animation: `los-fade-in 0.9s ease-in-out ${i * 0.18}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-surface px-4 py-3">
          {speaking && (
            <div className="mb-2 flex items-center justify-center gap-2 text-xs text-accent">
              <Icon name="chat" size={14} />
              Reproduciendo respuesta…
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escriba su pregunta…"
              className="min-w-0 flex-1 rounded-full border border-border bg-bg px-4 py-2.5 text-base text-ink outline-none placeholder:text-ink-3 focus:border-accent"
            />
            <button
              type="button"
              onClick={simulateVoice}
              aria-label="Voz"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-ink-3"
            >
              <Icon name="mic" size={18} />
            </button>
            <button
              type="submit"
              aria-label="Enviar"
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors disabled:opacity-40"
            >
              <Icon name="arrow-right" size={18} />
            </button>
          </form>
        </div>
      </div>
    </Sheet>
  );
}
