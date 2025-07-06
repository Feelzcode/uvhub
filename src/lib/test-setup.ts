import { createTestUser } from './auth';

// Add test users for development
export const setupTestUsers = () => {
  createTestUser('admin@example.com', 'password123');
  createTestUser('test@example.com', 'test123');
  
  console.log('Test users created:');
  console.log('- admin@example.com / password123');
  console.log('- test@example.com / test123');
};

// Call this function in development
if (process.env.NODE_ENV === 'development') {
  setupTestUsers();
} 