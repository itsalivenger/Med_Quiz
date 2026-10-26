import { NextRequest, NextResponse } from 'next/server';
import { getDb, UserDocument } from '@/lib/mongodb';
import { hashPassword, verifyPassword, signToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Veuillez saisir votre adresse email et votre mot de passe.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = await getDb();
    let user = await db.users.findOne({ email: cleanEmail });

    // Auto-seed demo student accounts if not already in DB
    if (!user) {
      if (
        (cleanEmail === 'etudiant.pass@medquiz.fr' && password === 'medecine2026') ||
        (cleanEmail === 'externe.edn@medquiz.fr' && password === 'externat2026')
      ) {
        const { hash, salt } = hashPassword(password);
        const demoUser: UserDocument = {
          id: uuidv4(),
          email: cleanEmail,
          passwordHash: hash,
          salt,
          name: cleanEmail.startsWith('etudiant') ? 'Alexandre (PASS)' : 'Camille (EDN)',
          year: cleanEmail.startsWith('etudiant') ? 'y1' : 'y5',
          faculty: 'FMPM',
          role: 'student',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        await db.users.insertOne(demoUser);
        user = demoUser;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Aucun compte associé à cette adresse email. Veuillez vérifier ou créer un compte.' },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect. Veuillez réessayer.' },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();
    await db.users.updateOne({ id: user.id }, { $set: { lastLoginAt: now } });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        year: user.year,
        faculty: user.faculty,
        role: user.role,
      },
    });

    response.cookies.set('medquiz_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('[API Login Error]', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de la connexion.' },
      { status: 500 }
    );
  }
}
