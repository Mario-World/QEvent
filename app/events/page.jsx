// app/events/page.jsx  (server component)
import React from "react";
import EventCard from "@/components/EventCard";

export const metadata = { title: "Events" };

const EVENTS_API = "https://qevent-backend.labs.crio.do/events";

async function fetchEvents() {
  try {
    const res = await fetch(EVENTS_API, { cache: "no-store" }); // no-store during dev; change to revalidate if needed
    if (!res.ok) {
      // return empty array so rendering doesn't throw
      console.error("Events fetch failed:", res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
}

export default async function EventsPage({ searchParams }) {
  // searchParams is available in server components in App Router
  const artist = searchParams?.artist ?? null; // e.g. "Alice Johnson"
  const tag = searchParams?.tag ?? null; // e.g. "Music"

  const data = await fetchEvents();

  // Normalise shape (mapping remote API fields to the shape EventCard expects)
  const mapped = data.map((ev) => ({
    id: ev.id ?? ev._id ?? ev.name, // fallback id
    image: ev.image ?? "/images/default.jpg",
    tags: Array.isArray(ev.tags) ? ev.tags : ev.tags ? [ev.tags] : [],
    date: ev.date ?? ev.startDate ?? new Date().toISOString(),
    time: ev.time ?? "7:00 PM",
    location: ev.location ?? "Unknown",
    name: ev.name ?? ev.title ?? "Untitled Event",
    artist: ev.artist ?? ev.performer ?? "Unknown Artist",
    price: typeof ev.price === "number" ? ev.price : Number(ev.price) || 0,
    description: ev.description ?? "",
  }));

  // apply filters if needed
  const filtered = mapped.filter((ev) => {
    if (artist) {
      return ev.artist && ev.artist.toLowerCase() === artist.toLowerCase();
    }
    if (tag) {
      // tag matching (case-insensitive)
      return ev.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
    }
    return true;
  });

  return (
    <main className="min-h-screen px-6 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Events {artist ? `— ${artist}` : tag ? `— ${tag}` : ""}
      </h1>

      {filtered.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="flex flex-wrap">
          {filtered.map((eventData) => (
            // EventCard is a client component (ok to import inside server component)
            <EventCard key={eventData.id} eventData={eventData} />
          ))}
        </div>
      )}
    </main>
  );
}
