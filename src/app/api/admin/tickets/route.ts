import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

function checkAdminAuth(req: NextRequest) {
  const token = extractTokenFromRequest(req) || req.cookies.get('medquiz_admin_token')?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload && payload.role === 'admin';
}

export async function GET(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 });
    }

    const db = await getDb();
    const cursor = await db.tickets.find();
    const tickets = await cursor.toArray();
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error('[API Admin Tickets GET]', error);
    return NextResponse.json({ error: 'Erreur de chargement des tickets.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Données incomplètes.' }, { status: 400 });
    }

    const db = await getDb();
    await db.tickets.updateOne({ id }, { $set: { status } });

    return NextResponse.json({ success: true, message: 'Ticket mis à jour avec succès.' });
  } catch (error) {
    console.error('[API Admin Tickets PATCH]', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du ticket.' }, { status: 500 });
  }
}
