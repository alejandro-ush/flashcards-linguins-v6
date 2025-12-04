// File: src/app/study/dev/page.tsx
// Página de prueba mínima para el flujo de estudio v6.1 (sin estilos ni DB).

"use client";

import { useState } from "react";
import type { Item, SkillState, StudyAttempt } from "@/core/types";
import { apiStart, apiAttempt, apiNext, apiEnd } from "@/core/client/studyClient";

export default function StudyDevPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [skills, setSkills] = useState<SkillState[]>([]);
  const [skillsBefore, setSkillsBefore] = useState<SkillState[] | null>(null);
  const [attempts, setAttempts] = useState<StudyAttempt[]>([]);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [messages, setMessages] = useState<any>(null);

  const log = (msg: string, data?: unknown) => {
    const text = data ? `${msg}: ${JSON.stringify(data, null, 2)}` : msg;
    setLogs((prev) => [text, ...prev].slice(0, 20));
  };

  const startSession = async () => {
    const res = await apiStart();
    if (!res.ok) {
      log("start error", res);
      return;
    }
    setSessionId(res.session_id);
    setItems(res.items);
    setSkills(res.initial_skills);
    setSkillsBefore(JSON.parse(JSON.stringify(res.initial_skills)) as SkillState[]);
    setAttempts([]);
    setSummary(null);
    setInsights(null);
    setMessages(null);
    setCurrentItem(res.items[0] ?? null);
    log("session started", { session_id: res.session_id });
  };

  const attemptItem = async (is_correct: boolean) => {
    if (!currentItem) {
      log("no current item");
      return;
    }
    const skill = skills.find((s) => s.item_id === currentItem.id);
    const res = await apiAttempt({
      item_id: currentItem.id,
      user_answer: is_correct ? "ok" : "err",
      response_time_ms: 1500,
      is_correct,
      current_skill: skill,
    });
    if (!res.ok || !res.skill || !res.attempt) {
      log("attempt error", res);
      return;
    }
    setSkills((prev) =>
      prev.map((s) => (s.item_id === res.skill.item_id ? res.skill! : s))
    );
    setAttempts((prev) => [...prev, res.attempt!]);
    log("attempt saved", res.attempt);
  };

  const loadNext = async () => {
    if (!items.length || !skills.length) {
      log("missing items/skills");
      return;
    }
    const res = await apiNext({
      items,
      skills,
      recentAttempts: attempts,
      sessionDurationMs: undefined,
    });
    if (!res.ok) {
      log("next error", res);
      return;
    }
    setCurrentItem(res.next_item ?? null);
    log("next item", res);
  };

  const endSession = async () => {
    if (sessionId === null) {
      log("no session");
      return;
    }
    const res = await apiEnd({
      session_id: Number(sessionId) || 0,
      attempts,
      skillsBefore: skillsBefore ?? [],
      skillsAfter: skills,
    });
    if (!res.ok) {
      log("end error", res);
      return;
    }
    setSummary(res.summary);
    setInsights(res.insights);
    setMessages({
      motivation: res.motivation,
      micro_goal: res.micro_goal,
      emotional: res.emotional,
    });
    log("session ended", res.summary);
  };

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h1>Study Dev Debug</h1>
      <p>Flujo v6.1 determinista (sin estilos, sin DB).</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={startSession}>Start</button>
        <button onClick={() => attemptItem(true)}>Attempt Correct</button>
        <button onClick={() => attemptItem(false)}>Attempt Wrong</button>
        <button onClick={loadNext}>Next Item</button>
        <button onClick={endSession}>End</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Session:</strong> {sessionId ?? "—"}
      </div>
      <div>
        <strong>Current Item:</strong>{" "}
        {currentItem ? JSON.stringify(currentItem) : "—"}
      </div>
      <div>
        <strong>Skills:</strong> {JSON.stringify(skills, null, 2)}
      </div>
      <div>
        <strong>Attempts:</strong> {JSON.stringify(attempts, null, 2)}
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Summary:</strong> {summary ? JSON.stringify(summary, null, 2) : "—"}
      </div>
      <div>
        <strong>Insights:</strong> {insights ? JSON.stringify(insights, null, 2) : "—"}
      </div>
      <div>
        <strong>Messages:</strong> {messages ? JSON.stringify(messages, null, 2) : "—"}
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Logs:</strong>
        <pre>{logs.join("\n")}</pre>
      </div>
    </div>
  );
}
