import crypto from 'crypto';

export type DeviceType = 'MOBILE' | 'TABLET' | 'DESKTOP' | 'UNKNOWN';

export function detectDeviceType(userAgent: string): DeviceType {
  if (!userAgent) return 'UNKNOWN';
  
  const ua = userAgent.toLowerCase();
  
  // Check for mobile
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'MOBILE';
  }
  
  // Check for tablet
  if (/ipad|android|tablet|kindle|playbook/i.test(ua)) {
    return 'TABLET';
  }
  
  // Default to desktop if it contains common desktop indicators
  if (/windows|mac|linux|x11/i.test(ua)) {
    return 'DESKTOP';
  }
  
  return 'UNKNOWN';
}

export function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  
  try {
    return crypto
      .createHash('sha256')
      .update(ip + process.env.NEXTAUTH_SECRET)
      .digest('hex');
  } catch {
    return null;
  }
}
