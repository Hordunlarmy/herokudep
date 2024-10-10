import cors from 'cors';

export const useCors = cors({
  origin: process.env.ALLOWED_ORIGINS || '*', // Restrict to allowed origins if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});