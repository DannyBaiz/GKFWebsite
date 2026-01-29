import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MembersPage() {
  const session = await getServerSession(authOptions as any);
  if (!session) redirect('/');
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mitgliederbereich</h2>
      <p>Willkommen, {session.user?.name || session.user?.email}</p>
      <a className="text-blue-600" href="/members/downloads">Downloads</a>
    </div>
  );
}
