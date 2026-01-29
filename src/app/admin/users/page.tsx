import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminUsers() {
  const session = await getServerSession(authOptions as any);
  if (!session || session.user.role !== 'ADMIN') redirect('/');
  const users = await prisma.user.findMany();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Benutzerverwaltung</h2>
      <form action={createUser} className="space-y-2 max-w-md">
        <input name="email" placeholder="Email" className="border p-2 w-full" />
        <input name="name" placeholder="Name" className="border p-2 w-full" />
        <select name="role" className="border p-2 w-full">
          <option>MEMBER</option>
          <option>BOARD</option>
          <option>ADMIN</option>
        </select>
        <input name="password" placeholder="Initial Password" className="border p-2 w-full" />
        <button className="bg-green-600 text-white px-4 py-2">Erstellen</button>
      </form>
      <ul className="mt-6">
        {users.map((u) => (
          <li key={u.id}>{u.email} — {u.role}</li>
        ))}
      </ul>
    </div>
  );
}

async function createUser(formData: FormData) {
  'use server';
  const email = String(formData.get('email') || '');
  const name = String(formData.get('name') || '');
  const role = String(formData.get('role') || 'MEMBER');
  const password = String(formData.get('password') || 'ChangeMe123!');
  const bcrypt = (await import('bcrypt')).default;
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, name, role, passwordHash: hash } as any });
}
