import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
    }

    const db = await getDb();
    const user = await db.users.findOne({ id: payload.userId });

    const attemptsCursor = await db.attempts.find({ userId: payload.userId });
    const attempts = await attemptsCursor.toArray();

    const totalSessions = attempts.length;
    const totalQuestions = attempts.reduce((acc, a) => acc + (a.total || 0), 0);
    const totalCorrect = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Today progress
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttempts = attempts.filter((a) => (a.createdAt || '').startsWith(todayStr));
    const todayQuestionsSolved = todayAttempts.reduce((acc, a) => acc + (a.total || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user?.id || payload.userId,
          name: user?.name || payload.name,
          email: user?.email || payload.email,
          year: user?.year || 'y1',
          faculty: user?.faculty || '',
        },
        stats: {
          totalSessions,
          totalQuestions,
          totalCorrect,
          accuracy,
          todayQuestionsSolved,
          streakDays: totalSessions > 0 ? Math.min(totalSessions, 7) : 0,
        },
        recentAttempts: attempts.slice(0, 10),
      },
    });
  } catch (error) {
    console.error('[API Student Dashboard Error]', error);
    return NextResponse.json({ error: 'Erreur lors du chargement du tableau de bord.' }, { status: 500 });
  }
}
