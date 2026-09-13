import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    const session = await getSession();
    
    if (session) {
      // Log audit
      await prisma.adminAuditLog.create({
        data: {
          userId: session.id,
          action: 'LOGOUT',
          entity: 'User',
          entityId: session.id,
        },
      });
    }
    
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
