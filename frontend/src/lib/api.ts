// Relative by default: in dev the Vite proxy forwards /api to the backend (see vite.config.ts)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";
