import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req);
    // Allow either bearer token or admin cookie
    const adminCookie = req.cookies.get('medquiz_admin_token')?.value;
    const effectiveToken = token || adminCookie;

    if (!effectiveToken) {
      return NextResponse.json({ error: 'Accès restreint. Authentification requise.' }, { status: 401 });
    }

    const payload = verifyToken(effectiveToken);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Privilèges administrateur requis.' }, { status: 403 });
    }

    const db = await getDb();

    const [totalStudents, totalQuestions, pendingReview, totalAttempts, openTickets] = await Promise.all([
      db.users.countDocuments(),
      db.questions.countDocuments(),
      db.questions.countDocuments({ status: 'review' }),
      db.attempts.countDocuments(),
      db.tickets.countDocuments({ status: 'open' }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalQuestions,
        pendingReview,
        totalAttempts,
        openTickets,
        uptime: '99.98%',
        databaseStatus: db.isMemory ? 'Mode Mémoire (Remplissez MONGODB_URI dans .env)' : 'Connecté à MongoDB Atlas',
      },
    });
  } catch (error) {
    console.error('[API Admin Stats Error]', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des métriques administratives.' }, { status: 500 });
  }
}
