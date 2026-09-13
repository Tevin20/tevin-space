/**
 * Validates and sanitizes URLs to prevent security issues
 */

const ALLOWED_PROTOCOLS = ['http://', 'https://'];
const BLOCKED_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0'];

export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // Check protocol
    if (!ALLOWED_PROTOCOLS.includes(`${parsedUrl.protocol}//`)) {
      return false;
    }
    
    // Check hostname
    const hostname = parsedUrl.hostname;
    if (!hostname) {
      return false;
    }
    
    // Block local/private addresses
    if (BLOCKED_DOMAINS.includes(hostname)) {
      return false;
    }
    
    // Block private IP ranges
    if (/^(10|172\.(1[6-9]|2[0-9]|3[01])|192\.168)\./.test(hostname)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string | null {
  if (!validateUrl(url)) {
    return null;
  }
  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
}
