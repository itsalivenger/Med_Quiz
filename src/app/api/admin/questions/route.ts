import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDb, QuestionDocument } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

function checkAdminAuth(req: NextRequest) {
  const token = extractTokenFromRequest(req) || req.cookies.get('medquiz_admin_token')?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload && payload.role === 'admin';
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const cursor = await db.questions.find();
    const questions = await cursor.toArray();
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error('[API Admin Questions GET]', error);
    return NextResponse.json({ error: 'Erreur de chargement des questions.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 });
    }

    const body = await req.json();
    const { itemCode, year, matter, vignette, difficulty, author, status } = body;

    if (!itemCode || !vignette) {
      return NextResponse.json({ error: 'Le code item et l’énoncé sont obligatoires.' }, { status: 400 });
    }

    const db = await getDb();
    const newQuestion: QuestionDocument = {
      id: uuidv4(),
      itemCode: itemCode.trim().toUpperCase(),
      year: year || '1ère Année',
      matter: matter || 'Général',
      vignette: vignette.trim(),
      status: status === 'review' ? 'review' : 'valid',
      difficulty: difficulty || 'Moyen',
      author: author || 'Enseignant Faculté',
      createdAt: new Date().toISOString(),
    };

    await db.questions.insertOne(newQuestion);
    return NextResponse.json({ success: true, data: newQuestion }, { status: 201 });
  } catch (error) {
    console.error('[API Admin Questions POST]', error);
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement de la question.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Identifiant de question manquant.' }, { status: 400 });
    }

    const db = await getDb();
    await db.questions.deleteOne({ id });

    return NextResponse.json({ success: true, message: 'Question supprimée avec succès.' });
  } catch (error) {
    console.error('[API Admin Questions DELETE]', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de la question.' }, { status: 500 });
  }
}
