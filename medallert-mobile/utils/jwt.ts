import * as jose from "jose";

export function getJwtSubIfNotExpired(token: string): string | null {
  try {
    const payload = jose.decodeJwt(token) as Record<string, unknown>;
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const exp = typeof payload.exp === "number" ? payload.exp : null;
    if (!sub) return null;
    if (exp !== null && Math.floor(Date.now() / 1000) >= exp) return null;
    return sub;
  } catch {
    return null;
  }
}
