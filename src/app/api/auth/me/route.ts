import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const db = await getDb();
    const user = await db.users.findOne({ id: payload.userId });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        year: user.year,
        faculty: user.faculty,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[API Me Error]', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
