import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any);
  if (!session) return new Response('Unauthorized', { status: 401 });
  const file = await prisma.fileAsset.findUnique({ where: { id: params.id } });
  if (!file) return new Response('Not found', { status: 404 });
  const storage = process.env.STORAGE_PATH || './storage';
  const filePath = path.join(storage, file.storedName);
  if (!fs.existsSync(filePath)) return new Response('File missing', { status: 404 });
  const stream = fs.createReadStream(filePath);
  return new Response(stream, {
    headers: { 'Content-Type': file.mimeType, 'Content-Disposition': `attachment; filename="${file.originalName}"` }
  });
}
