import { cookies } from 'next/headers';
import { verifyToken } from './auth';
import { prisma } from './db';

export interface SessionUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = verifyToken(token);
    if (!payload || typeof payload === 'string') {
      return null;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: (payload as any).userId },
      select: {
        id: true,
        email: true,
        role: true,
        active: true,
      },
    });
    
    if (!user || !user.active) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}
