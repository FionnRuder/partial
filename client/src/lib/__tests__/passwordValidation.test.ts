import { describe, it, expect } from 'vitest';
import { validatePassword, passwordPolicy } from '../passwordValidation';

describe('validatePassword', () => {
  it('should return valid for a password that meets all requirements', () => {
    const result = validatePassword('Password123!');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject passwords shorter than minimum length', () => {
    const result = validatePassword('Pass1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      `Password must be at least ${passwordPolicy.minLength} characters long`
    );
  });

  it('should reject passwords without uppercase letters', () => {
    const result = validatePassword('password123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Password must contain at least one uppercase letter'
    );
  });

  it('should reject passwords without lowercase letters', () => {
    const result = validatePassword('PASSWORD123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Password must contain at least one lowercase letter'
    );
  });

  it('should reject passwords without numbers', () => {
    const result = validatePassword('Password!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('should reject passwords without special characters', () => {
    const result = validatePassword('Password123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Password must contain at least one special character'
    );
  });

  it('should return multiple errors for passwords with multiple issues', () => {
    const result = validatePassword('pass');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
