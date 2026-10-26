import { NextRequest, NextResponse } from 'next/server';
import { getDb, UserDocument } from '@/lib/mongodb';
import { hashPassword, signToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, year, faculty } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Adresse email universitaire invalide.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0]).trim();

    const db = await getDb();
    const existing = await db.users.findOne({ email: cleanEmail });

    if (existing) {
      return NextResponse.json(
        { error: 'Un compte avec cette adresse email existe déjà. Veuillez vous connecter.' },
        { status: 409 }
      );
    }

    const { hash, salt } = hashPassword(password);
    const userId = uuidv4();
    const now = new Date().toISOString();

    const newUser: UserDocument = {
      id: userId,
      email: cleanEmail,
      passwordHash: hash,
      salt,
      name: cleanName,
      year: year || 'y1',
      faculty: faculty || '',
      role: 'student',
      createdAt: now,
      lastLoginAt: now,
    };

    await db.users.insertOne(newUser);

    const token = signToken({
      userId,
      email: cleanEmail,
      name: cleanName,
      role: 'student',
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email: cleanEmail,
        name: cleanName,
        year: newUser.year,
        faculty: newUser.faculty,
        role: 'student',
      },
    });

    response.cookies.set('medquiz_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('[API Signup Error]', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de l’inscription.' },
      { status: 500 }
    );
  }
}
