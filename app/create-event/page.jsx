// app/create-event/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

const EVENTS_API = "https://qevent-backend.labs.crio.do/events";

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // form state
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    price: "",
    image: "",
    tags: "",
    artist: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // if session is determined and user is not authenticated, redirect
    if (status === "unauthenticated") {
      router.replace("/events");
    }
  }, [status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // basic validation
    if (!form.name || !form.date || !form.time || !form.location) {
      alert("Please fill required fields: name, date, time, location.");
      return;
    }

    setSubmitting(true);

    try {
      // generate payload
      const randomImgId = Math.floor(Math.random() * 99) + 1; // 1..99
      const payload = {
        id: uuidv4(),
        name: form.name,
        date: form.date, // keep ISO or date string as entered
        time: form.time,
        location: form.location,
        tags:
          form.tags && form.tags.trim().length
            ? form.tags.split(",").map((t) => t.trim())
            : [],
        artist: form.artist || "Unknown Artist",
        price: form.price ? Number(form.price) : 0,
        description: form.description || "",
        image:
          form.image?.trim().length > 0
            ? form.image.trim()
            : `https://randomuser.me/api/portraits/men/${randomImgId}.jpg`,
      };

      const res = await fetch(EVENTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // read body if possible for debug
        let errText = `status ${res.status}`;
        try {
          const body = await res.json();
          errText = body?.message || JSON.stringify(body);
        } catch {
          // ignore parse errors
        }
        throw new Error(`API error: ${errText}`);
      }

      // success
      alert("Event created successfully!");
      router.push("/events");
    } catch (err) {
      console.error("Create event failed:", err);
      alert("Event creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen px-6 py-12">
        <p>Checking authentication…</p>
      </main>
    );
  }

  // If not authenticated we already redirect, so show nothing
  if (status !== "authenticated") return null;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Create Event</h1>
        <p className="mb-6">Fill out the form to create a new event.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Event name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Date *</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Time *</label>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Artist</label>
            <input
              name="artist"
              value={form.artist}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tags (comma separated)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Music, Live, Festival"
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Image URL (optional)</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-orange-400 to-teal-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Event"}
            </button>

            <Link href="/events" className="text-sm text-slate-600 hover:underline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
