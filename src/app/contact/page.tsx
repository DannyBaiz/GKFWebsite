import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export default function ContactPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
      <form action={submit} className="space-y-4 max-w-lg">
        <div>
          <label className="block">Name</label>
          <input name="name" className="border p-2 w-full" />
        </div>
        <div>
          <label className="block">Email</label>
          <input name="email" type="email" className="border p-2 w-full" />
        </div>
        <div>
          <label className="block">Nachricht</label>
          <textarea name="message" className="border p-2 w-full" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2">Senden</button>
      </form>
    </div>
  );
}

async function submit(formData: FormData) {
  'use server';
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const message = String(formData.get('message') || '');
  await prisma.contactSubmission.create({ data: { name, email, message } });
  revalidatePath('/contact');
}
