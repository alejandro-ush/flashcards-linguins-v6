// src/app/api/decks/route.ts

import { NextResponse } from 'next/server';
import { loadCards } from '@/lib/cards/loadCards';

export async function GET() {
  try {
    // carga DE → ES por defecto
    const cards = await loadCards({ from: 'de', to: 'es', limit: 50 });

    return NextResponse.json({
      ok: true,
      count: cards.length,
      cards,
    });
  } catch (err) {
    console.error('Error en /api/decks:', err);
    return NextResponse.json({ ok: false, error: 'Deck load failed' }, { status: 500 });
  }
}
