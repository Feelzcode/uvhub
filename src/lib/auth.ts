import crypto from 'crypto';

// In a real app, you'd store these in a database
// For demo purposes, we'll use a simple in-memory store
const resetTokens = new Map<string, { email: string; expiresAt: Date }>();

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const createPasswordResetToken = (email: string): string => {
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  
  resetTokens.set(token, { email, expiresAt });
  
  // Clean up expired tokens
  cleanupExpiredTokens();
  
  return token;
};

export const validateResetToken = (token: string): string | null => {
  const tokenData = resetTokens.get(token);
  
  if (!tokenData) {
    return null;
  }
  
  if (new Date() > tokenData.expiresAt) {
    resetTokens.delete(token);
    return null;
  }
  
  return tokenData.email;
};

export const removeResetToken = (token: string): void => {
  resetTokens.delete(token);
};

const cleanupExpiredTokens = (): void => {
  const now = new Date();
  for (const [token, data] of resetTokens.entries()) {
    if (now > data.expiresAt) {
      resetTokens.delete(token);
    }
  }
};

// Mock user database - replace with your actual database
const users = new Map<string, { email: string; password: string }>();

export const findUserByEmail = (email: string) => {
  return users.get(email);
};

export const updateUserPassword = (email: string, newPassword: string) => {
  const user = users.get(email);
  if (user) {
    user.password = newPassword; // In real app, hash the password
    users.set(email, user);
    return true;
  }
  return false;
};

// For demo purposes - add a test user
export const createTestUser = (email: string, password: string) => {
  users.set(email, { email, password });
}; 