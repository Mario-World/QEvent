"use client";

import React, { useEffect, useState } from "react";
import ArtistCard from "@/components/ArtistCard";

const ARTISTS_API = "https://qevent-backend.labs.crio.do/artists";

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchArtists() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(ARTISTS_API);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();

        // data may be an array or an object with a list property.
        const list = Array.isArray(data) ? data : data.artists ?? [];

        // Map provider fields to what ArtistCard expects as artistData
        const mapped = list.map((a) => ({
          // image: avatar/photo || fallback
          image: a.image ?? a.avatar ?? a.photo ?? "/images/artist-default.jpg",
          // display name
          name: a.name ?? a.fullName ?? a.title ?? "Unknown Artist",
          // description/bio
          description: a.bio ?? a.description ?? a.about ?? "",
          // location / city / venue
          location: a.location ?? a.city ?? a.place ?? "",
          // some data your ArtistCard references as `artist` (kept if present)
          artist: a.stageName ?? a.artistName ?? a.handle ?? "",
          // keep id if you want to link later
          id: a._id ?? a.id ?? undefined,
        }));

        if (mounted) setArtists(mapped);
      } catch (err) {
        console.error("Error fetching artists:", err);
        if (mounted) setError(err.message || "Failed to load artists");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchArtists();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen px-6 py-8">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-teal-600 bg-clip-text text-transparent">
        Artists
      </h1>

      {loading && <p>Loading artists…</p>}
      {error && (
        <div className="mb-4 text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && artists.length === 0 && !error && <p>No artists found.</p>}

      <div className="flex flex-wrap gap-6">
        {artists.map((artist, idx) => (
          <ArtistCard key={artist.id ?? artist.name + idx} artistData={artist} />
        ))}
      </div>
    </main>
  );
}
