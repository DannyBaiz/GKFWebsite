import { prisma } from '@/lib/prisma';

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startsAt: 'asc' } });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Events</h2>
      <ul className="space-y-4">
        {events.map((e) => (
          <li key={e.id} className="border p-4 rounded">
            <h3 className="font-semibold">{e.title}</h3>
            <p>{e.location}</p>
            <p>{new Date(e.startsAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
