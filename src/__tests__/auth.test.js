/**
 * Tests for src/utils/auth.js
 */
import { isTokenValid, logout } from '../utils/auth';

// Helper to build unsigned JWTs for tests
const base64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64');
const makeToken = (payload) => `eyJhbGciOiJub25lIn0.${base64(payload)}.signature`;

describe('utils/auth.isTokenValid', () => {
  beforeEach(() => {
    // Reset cached state inside module (indirectly via logout)
    logout();
  });

  test('returns true for token without exp', () => {
    const token = makeToken({ userId: 1, name: 'test' });
    expect(isTokenValid(token)).toBe(true);
  });

  test('returns true when exp is in the future', () => {
    const future = Math.floor(Date.now() / 1000) + 60; // +60s
    const token = makeToken({ exp: future });
    expect(isTokenValid(token)).toBe(true);
  });

  test('returns false when exp is in the past', () => {
    const past = Math.floor(Date.now() / 1000) - 60; // -60s
    const token = makeToken({ exp: past });
    expect(isTokenValid(token)).toBe(false);
  });
});

describe('utils/auth.logout', () => {
  test('clears token from localStorage', () => {
    localStorage.setItem('token', 'abc');
    logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});

