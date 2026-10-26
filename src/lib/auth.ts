import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'medquiz_jwt_fallback_secret_key_2026';

export interface UserTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  iat: number;
  exp: number;
}

/**
 * Hash password using PBKDF2 with a random salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify a plain text password against stored hash & salt
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === storedHash;
}

/**
 * Generate a signed JWT-like token (Base64url HMAC-SHA256)
 */
export function signToken(payload: Omit<UserTokenPayload, 'iat' | 'exp'>, expiresInHours = 72): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInHours * 3600;
  const fullPayload: UserTokenPayload = { ...payload, iat, exp };

  const header = { alg: 'HS256', typ: 'JWT' };
  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64UrlPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64UrlHeader}.${base64UrlPayload}`)
    .digest('base64url');

  return `${base64UrlHeader}.${base64UrlPayload}.${signature}`;
}

/**
 * Verify and decode a token
 */
export function verifyToken(token: string): UserTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [base64UrlHeader, base64UrlPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${base64UrlHeader}.${base64UrlPayload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payloadText = Buffer.from(base64UrlPayload, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadText) as UserTokenPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract token from Request (Authorization header or cookie)
 */
export function extractTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check cookies
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/medquiz_token=([^;]+)/);
  if (match) {
    return decodeURIComponent(match[1]);
  }

  return null;
}
