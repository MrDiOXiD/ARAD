// src/utils/http/extract-client-ip.util.ts
import { Request } from 'express';
 
export function extractClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded.split(',')[0];
    if (first?.trim()) return first.trim();
  }
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}
 