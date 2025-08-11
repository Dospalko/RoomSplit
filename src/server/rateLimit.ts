// Simple rate limiting utility
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = identifier;
  
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false; // Not rate limited
  }
  
  if (current.count >= limit) {
    return true; // Rate limited
  }
  
  current.count++;
  return false; // Not rate limited
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute
