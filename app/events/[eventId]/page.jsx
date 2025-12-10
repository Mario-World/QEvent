// app/events/[eventId]/page.jsx
import React from "react";
import Link from "next/link";
import Tag from "@/components/Tag";

const EVENTS_API_BASE = "https://qevent-backend.labs.crio.do/events";

export async function generateMetadata({ params }) {
  const id = params.eventId;
  try {
    const res = await fetch(`${EVENTS_API_BASE}/${encodeURIComponent(id)}`);
    if (!res.ok) return { title: "Event" };
    const ev = await res.json();
    return { title: ev.name ?? ev.title ?? "Event" };
  } catch {
    return { title: "Event" };
  }
}

export default async function EventDetailPage({ params }) {
  const { eventId } = params;

  // Strict fetch by id (official API)
  const res = await fetch(`${EVENTS_API_BASE}/${encodeURIComponent(eventId)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="min-h-screen px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Event not found</h1>
          <p className="mb-6">Could not load event with id: {eventId}</p>
          <Link href="/events">
            <button className="bg-slate-200 px-4 py-2 rounded-md">Back to events</button>
          </Link>
        </div>
      </main>
    );
  }

  const ev = await res.json();

  const event = {
    id: ev.id ?? ev._id,
    name: ev.name ?? ev.title ?? "Untitled Event",
    image: ev.image ?? "/images/default.jpg",
    tags: ev.tags ?? [],
    date: ev.date ?? null,
    time: ev.time ?? null,
    location: ev.location ?? "",
    artist: ev.artist ?? "Unknown Artist",
    price: typeof ev.price === "number" ? ev.price : Number(ev.price) || 0,
    description: ev.description ?? ev.details ?? ev.info ?? "No description provided.",
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: title, meta, description */}
        <div className="lg:col-span-2">
          <h1 className="text-5xl font-extrabold mb-3 text-orange-500">{event.name}</h1>
          <p className="text-sm text-slate-600 mb-2">
            {event.location} {event.date ? " | " + new Date(event.date).toLocaleString() : ""}
          </p>
          <p className="text-sm text-slate-600 mb-6">{event.artist}</p>

          <div className="flex gap-3 mb-6 flex-wrap">
            {event.tags.map((t) => (
              <Tag key={t} text={t} />
            ))}
          </div>

          <p className="text-base leading-relaxed text-slate-800 mb-8">{event.description}</p>

          <p className="text-2xl font-bold text-emerald-700">${event.price > 0 ? event.price : "FREE"}</p>
        </div>

        {/* Right column: image + CTA */}
        <aside className="lg:col-span-1 flex flex-col items-stretch gap-6">
          <div className="w-full rounded-md overflow-hidden shadow-lg">
            <img src={event.image} alt={event.name} className="w-full h-64 object-cover" />
          </div>

          <div className="border rounded-md p-4 shadow-sm">
            <h4 className="font-semibold mb-2">Book Tickets</h4>
            <p className="text-sm mb-4">Price: {event.price > 0 ? `$ ${event.price}` : "FREE"}</p>
            <button className="w-full bg-gradient-to-r from-orange-400 to-teal-600 text-white px-4 py-2 rounded-md">
              Buy Tickets
            </button>
            <div className="mt-3 text-right">
              <Link href="/events">
                <a className="text-sm text-slate-600 hover:underline">Back to events</a>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
