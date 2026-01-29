import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminFiles() {
  const session = await getServerSession(authOptions as any);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'BOARD')) redirect('/');
  const files = await prisma.fileAsset.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dateien</h2>
      <form action={upload} encType="multipart/form-data" className="space-y-2">
        <input name="file" type="file" />
        <button className="bg-blue-600 text-white px-4 py-2">Hochladen</button>
      </form>
      <ul className="mt-4">
        {files.map((f) => (
          <li key={f.id} className="flex justify-between">
            <span>{f.originalName}</span>
            <form action={del} method="post">
              <input type="hidden" name="id" value={f.id} />
              <button className="text-red-600">Löschen</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function upload(formData: FormData) {
  'use server';
  const file = formData.get('file') as unknown as File;
  if (!file) return;
  const fs = await import('fs');
  const path = await import('path');
  const storage = process.env.STORAGE_PATH || './storage';
  await fs.promises.mkdir(storage, { recursive: true });
  const storedName = `${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.promises.writeFile(path.join(storage, storedName), buffer);
  const session = await (await import('next-auth')).getServerSession();
  const userId = (session as any)?.user?.id;
  await prisma.fileAsset.create({ data: { originalName: file.name, storedName, mimeType: file.type, size: buffer.length, uploadedByUserId: userId } });
}

async function del(formData: FormData) {
  'use server';
  const id = String(formData.get('id'));
  const file = await prisma.fileAsset.findUnique({ where: { id } });
  if (!file) return;
  const fs = await import('fs');
  const path = await import('path');
  const storage = process.env.STORAGE_PATH || './storage';
  await fs.promises.unlink(path.join(storage, file.storedName)).catch(() => null);
  await prisma.fileAsset.delete({ where: { id } });
}
