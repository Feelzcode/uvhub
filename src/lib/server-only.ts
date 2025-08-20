// This module is for server-side only code
// It helps prevent accidental imports in client components

export function assertServerOnly() {
  if (typeof window !== 'undefined') {
    throw new Error('This module can only be imported on the server side');
  }
}
