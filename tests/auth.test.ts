import { describe, it, expect } from 'vitest';
import bcrypt from 'bcrypt';

describe('auth basics', () => {
  it('hashes and compares password with bcrypt', async () => {
    const pw = 'Test123!';
    const hash = await bcrypt.hash(pw, 10);
    const ok = await bcrypt.compare(pw, hash);
    expect(ok).toBe(true);
  });
});
