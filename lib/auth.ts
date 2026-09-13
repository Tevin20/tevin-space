import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(payload: object, expiresIn = '24h'): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not defined');
  }
  return sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): object | null {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not defined');
  }
  try {
    return verify(token, secret) as object;
  } catch {
    return null;
  }
}
