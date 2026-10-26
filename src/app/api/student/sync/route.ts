import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDb, AttemptDocument } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }

    const body = await req.json();
    const attempts = body.attempts || [];

    if (!Array.isArray(attempts) || attempts.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const db = await getDb();
    const docsToInsert: AttemptDocument[] = attempts.map((a: { course_id?: string; courseId?: string; score?: number; total?: number; mode?: 'static' | 'dynamic'; date?: string }) => ({
      id: uuidv4(),
      userId: payload.userId,
      courseId: a.course_id || a.courseId || 'unknown',
      score: Number(a.score) || 0,
      total: Number(a.total) || 0,
      mode: a.mode === 'dynamic' ? 'dynamic' : 'static',
      createdAt: a.date || new Date().toISOString(),
    }));

    await db.attempts.insertMany(docsToInsert);

    return NextResponse.json({ success: true, count: docsToInsert.length });
  } catch (error) {
    console.error('[API Student Sync Error]', error);
    return NextResponse.json({ error: 'Erreur lors de la synchronisation de l’historique.' }, { status: 500 });
  }
}
