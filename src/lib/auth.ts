import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';

// Simple in-memory rate limiter per IP
const loginAttempts = new Map<string, { count: number; last: number }>();
const LIMIT = 5;
const WINDOW_MS = 1000 * 60 * 15;

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (now - entry.last > WINDOW_MS) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= LIMIT;
}

function incrementAttempts(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry) loginAttempts.set(key, { count: 1, last: now });
  else loginAttempts.set(key, { count: entry.count + 1, last: now });
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const ip = (req as any).headers['x-forwarded-for'] || (req as any).socket?.remoteAddress || 'local';
        if (isRateLimited(ip)) throw new Error('Too many login attempts. Try later.');
        if (!credentials?.email || !credentials?.password) {
          incrementAttempts(ip);
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          incrementAttempts(ip);
          return null;
        }
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) {
          incrementAttempts(ip);
          return null;
        }
        return { id: user.id, email: user.email, name: user.name, role: user.role } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session as any).user.role = token.role;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
