import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DownloadsPage() {
  const session = await getServerSession(authOptions as any);
  if (!session) redirect('/');
  const files = await prisma.fileAsset.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Downloads</h2>
      <ul>
        {files.map((f) => (
          <li key={f.id} className="flex justify-between">
            <span>{f.originalName}</span>
            <a className="text-blue-600" href={`/api/files/${f.id}`}>Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
