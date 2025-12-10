// app/events/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { useSearchParams } from "next/navigation";

const EVENTS_API = "https://qevent-backend.labs.crio.do/events";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const tagParam = searchParams?.get("tag"); // e.g. "Music"
  const artistParam = searchParams?.get("artist"); // e.g. "Alice Johnson"

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let abort = false;

    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch(EVENTS_API);
        const data = await res.json();

        // Normalize the data so fields exist as expected by EventCard
        const mapped = data.map((ev) => ({
          id: ev.id,
          image: ev.image ?? "/images/default.jpg",
          tags: ev.tags ?? [],
          date: ev.date ?? ev.startDate ?? new Date().toISOString(),
          time: ev.time ?? "7:00 PM",
          location: ev.location ?? "Unknown",
          name: ev.name ?? ev.title ?? "Untitled Event",
          artist: ev.artist ?? ev.performer ?? "Unknown Artist",
          price: ev.price ?? 0,
          description: ev.description ?? "",
        }));

        // apply filters (if any)
        const filtered = mapped.filter((ev) => {
          let ok = true;
          if (tagParam) {
            // match if any of the event tags equal (case-insensitive) the tag param
            ok = ok && ev.tags.some((t) => t.toLowerCase() === tagParam.toLowerCase());
          }
          if (artistParam) {
            ok = ok && ev.artist.toLowerCase() === artistParam.toLowerCase();
          }
          return ok;
        });

        if (!abort) {
          setEvents(filtered);
        }
      } catch (err) {
        console.error("Error loading events:", err);
        if (!abort) setEvents([]);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    fetchEvents();

    return () => {
      abort = true;
    };
  }, [tagParam, artistParam]);

  return (
    <main className="min-h-screen px-6 py-8">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-teal-600 bg-clip-text text-transparent">
        Events
      </h1>

      {tagParam && (
        <p className="text-lg mb-4">
          Showing events tagged: <strong>{tagParam}</strong>
        </p>
      )}

      {artistParam && (
        <p className="text-lg mb-4">
          Showing events by: <strong>{artistParam}</strong>
        </p>
      )}

      {loading && <p>Loading events…</p>}

      <div className="flex flex-wrap">
        {!loading && events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((eventData, idx) => <EventCard key={eventData.id ?? idx} eventData={eventData} />)
        )}
      </div>
    </main>
  );
}
