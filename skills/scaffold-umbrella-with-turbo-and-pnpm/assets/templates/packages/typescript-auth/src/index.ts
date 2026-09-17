export type VerifyOptions = {
  issuer: string;
  audience: string;
};

export type VerifiedToken = {
  sub: string;
  iss: string;
  aud: string | string[];
};

function decodePayload(token: string): Record<string, unknown> {
  const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
  const parts = raw.split('.');
  if (parts.length !== 3) {
    throw new Error('invalid token');
  }
  const json = Buffer.from(parts[1], 'base64url').toString('utf8');
  const payload = JSON.parse(json) as Record<string, unknown>;
  if (payload == null || typeof payload !== 'object') {
    throw new Error('invalid token');
  }
  return payload;
}

export function verifyBearer(token: string, options: VerifyOptions): VerifiedToken {
  const payload = decodePayload(token);
  if (payload.iss !== options.issuer) {
    throw new Error('issuer mismatch');
  }
  const aud = payload.aud;
  const audOk =
    aud === options.audience || (Array.isArray(aud) && aud.includes(options.audience));
  if (!audOk) {
    throw new Error('audience mismatch');
  }
  if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
    throw new Error('expired');
  }
  return {
    sub: String(payload.sub ?? ''),
    iss: String(payload.iss),
    aud: Array.isArray(aud) ? aud.map(String) : String(aud),
  };
}
