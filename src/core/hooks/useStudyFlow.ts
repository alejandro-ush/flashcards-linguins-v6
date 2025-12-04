// File: src/core/hooks/useStudyFlow.ts
// Hook determinista v6.1 para orquestar el flujo de estudio usando studyClient.

"use client";

import { useState, useMemo } from "react";
import type {
  Item,
  SkillState,
  StudyAttempt,
  StudySessionSummary,
  InsightSnapshot,
} from "@/core/types";
import {
  apiStart,
  apiAttempt,
  apiNext,
  apiEnd,
} from "@/core/client/studyClient";

type LoadingState = {
  start: boolean;
  answer: boolean;
  next: boolean;
  end: boolean;
};

type ErrorState = {
  start: string | null;
  answer: string | null;
  next: string | null;
  end: string | null;
};

const INITIAL_LOADING: LoadingState = {
  start: false,
  answer: false,
  next: false,
  end: false,
};

const INITIAL_ERROR: ErrorState = {
  start: null,
  answer: null,
  next: null,
  end: null,
};

export function useStudyFlow() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [skillsBefore, setSkillsBefore] = useState<SkillState[] | null>(null);
  const [skills, setSkills] = useState<SkillState[]>([]);
  const [attempts, setAttempts] = useState<StudyAttempt[]>([]);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [summary, setSummary] = useState<StudySessionSummary | null>(null);
  const [insights, setInsights] = useState<InsightSnapshot | null>(null);
  const [messages, setMessages] = useState<{
    motivation: string;
    micro_goal: string;
    emotional: string;
  } | null>(null);

  const [loading, setLoading] = useState<LoadingState>(INITIAL_LOADING);
  const [error, setError] = useState<ErrorState>(INITIAL_ERROR);

  const canAnswer = useMemo(
    () => currentItem !== null && !loading.answer,
    [currentItem, loading.answer]
  );

  const canNext = useMemo(
    () => !loading.next && items.length > 0 && skills.length > 0,
    [loading.next, items.length, skills.length]
  );

  async function start(): Promise<{ ok: boolean }> {
    setLoading((prev) => ({ ...prev, start: true }));
    setError((prev) => ({ ...prev, start: null }));

    const res = await apiStart();
    setLoading((prev) => ({ ...prev, start: false }));

    if (!res.ok) {
      setError((prev) => ({ ...prev, start: "start failed" }));
      return { ok: false };
    }

    const clonedSkills = JSON.parse(
      JSON.stringify(res.initial_skills)
    ) as SkillState[];

    setSessionId(res.session_id);
    setItems(res.items);
    setSkills(res.initial_skills);
    setSkillsBefore(clonedSkills);
    setAttempts([]);
    setSummary(null);
    setInsights(null);
    setMessages(null);
    setCurrentItem(res.items[0] ?? null);

    return { ok: true };
  }

  async function answer(
    isCorrect: boolean,
    responseTimeMs: number
  ): Promise<{ ok: boolean; attempt?: StudyAttempt; updatedSkill?: SkillState }> {
    if (!currentItem) {
      return { ok: false };
    }

    setLoading((prev) => ({ ...prev, answer: true }));
    setError((prev) => ({ ...prev, answer: null }));

    const currentSkill = skills.find((s) => s.item_id === currentItem.id);
    const res = await apiAttempt({
      item_id: currentItem.id,
      user_answer: isCorrect ? "ok" : "err",
      response_time_ms: responseTimeMs,
      is_correct: isCorrect,
      current_skill: currentSkill,
    });

    setLoading((prev) => ({ ...prev, answer: false }));

    if (!res.ok || !res.attempt || !res.skill) {
      setError((prev) => ({ ...prev, answer: res.error ?? "answer failed" }));
      return { ok: false };
    }

    setSkills((prev) =>
      prev.map((s) => (s.item_id === res.skill!.item_id ? res.skill! : s))
    );
    setAttempts((prev) => [...prev, res.attempt!]);

    return { ok: true, attempt: res.attempt, updatedSkill: res.skill };
  }

  async function next(): Promise<{ ok: boolean; item: Item | null }> {
    setLoading((prev) => ({ ...prev, next: true }));
    setError((prev) => ({ ...prev, next: null }));

    const res = await apiNext({
      items,
      skills,
      recentAttempts: attempts,
      sessionDurationMs: undefined,
    });

    setLoading((prev) => ({ ...prev, next: false }));

    if (!res.ok) {
      setError((prev) => ({ ...prev, next: res.error ?? "next failed" }));
      return { ok: false, item: null };
    }

    setCurrentItem(res.next_item ?? null);
    return { ok: true, item: res.next_item ?? null };
  }

  async function end(): Promise<{ ok: boolean }> {
    if (sessionId === null) {
      return { ok: false };
    }

    setLoading((prev) => ({ ...prev, end: true }));
    setError((prev) => ({ ...prev, end: null }));

    const res = await apiEnd({
      session_id: Number(sessionId) || 0,
      attempts,
      skillsBefore: skillsBefore ?? [],
      skillsAfter: skills,
    });

    setLoading((prev) => ({ ...prev, end: false }));

    if (!res.ok) {
      setError((prev) => ({ ...prev, end: res.error ?? "end failed" }));
      return { ok: false };
    }

    setSummary(res.summary);
    setInsights(res.insights);
    setMessages({
      motivation: res.motivation,
      micro_goal: res.micro_goal,
      emotional: res.emotional,
    });

    return { ok: true };
  }

  function reset(): void {
    setSessionId(null);
    setItems([]);
    setSkillsBefore(null);
    setSkills([]);
    setAttempts([]);
    setCurrentItem(null);
    setSummary(null);
    setInsights(null);
    setMessages(null);
    setLoading(INITIAL_LOADING);
    setError(INITIAL_ERROR);
  }

  return {
    sessionId,
    items,
    skillsBefore,
    skills,
    attempts,
    currentItem,
    summary,
    insights,
    messages,

    loading,
    error,

    canAnswer,
    canNext,

    start,
    answer,
    next,
    end,
    reset,
  };
}
