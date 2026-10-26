import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDb, AttemptDocument } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }

    const db = await getDb();
    const attemptsCursor = await db.attempts.find({ userId: payload.userId });
    const attempts = await attemptsCursor.toArray();

    return NextResponse.json({ success: true, data: attempts });
  } catch (error) {
    console.error('[API Student Attempts GET]', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

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
    const { courseId, score, total, mode } = body;

    const db = await getDb();
    const newAttempt: AttemptDocument = {
      id: uuidv4(),
      userId: payload.userId,
      courseId: courseId || 'general',
      score: Number(score) || 0,
      total: Number(total) || 0,
      mode: mode === 'dynamic' ? 'dynamic' : 'static',
      createdAt: new Date().toISOString(),
    };

    await db.attempts.insertOne(newAttempt);

    return NextResponse.json({ success: true, data: newAttempt }, { status: 201 });
  } catch (error) {
    console.error('[API Student Attempts POST]', error);
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement de l’évaluation.' }, { status: 500 });
  }
}
