import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { verifyBearer } from './index.ts';

function unsignedJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.`;
}

describe('verifyBearer', () => {
  const opts = { issuer: 'https://issuer.example', audience: 'api' };

  it('accepts matching iss and aud', () => {
    const token = unsignedJwt({
      iss: opts.issuer,
      aud: 'api',
      sub: 'user-1',
      exp: Math.floor(Date.now() / 1000) + 60,
    });
    assert.equal(verifyBearer(token, opts).sub, 'user-1');
  });

  it('rejects the wrong issuer', () => {
    const token = unsignedJwt({ iss: 'https://other.example', aud: 'api', sub: 'x' });
    assert.throws(() => verifyBearer(token, opts), /issuer mismatch/);
  });
});
