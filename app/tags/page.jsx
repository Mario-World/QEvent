"use client";

import React, { useEffect, useState } from "react";
import Tag from "@/components/Tag";
import { useRouter } from "next/navigation";

const TAGS_API = "https://qevent-backend.labs.crio.do/tags";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function fetchTags() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(TAGS_API);
        if (!res.ok) throw new Error(`Tags fetch failed: ${res.status}`);
        const data = await res.json();

        // DEBUG: inspect raw data in console (remove in production)
        console.debug("Raw tags API response:", data);

        // Accept either array of strings or array of objects
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.tags)) {
          list = data.tags;
        } else {
          // Try to handle other shapes gracefully
          list = Object.values(data || {}).flat().filter(Boolean);
        }

        // Normalize each tag to a string for safe rendering
        const normalized = list.map((t) => {
          if (typeof t === "string") return t;
          // try common fields
          if (t === null || t === undefined) return "";
          if (typeof t === "object") {
            // prefer common keys then fallback to JSON string (short)
            return (
              t.name ??
              t.text ??
              t.tag ??
              (t.value && typeof t.value === "string" ? t.value : JSON.stringify(t))
            );
          }
          // fallback to string coercion
          return String(t);
        }).filter(Boolean); // remove empty strings

        if (mounted) setTags(normalized);
      } catch (err) {
        console.error("Error loading tags:", err);
        if (mounted) setError(err.message || "Failed to load tags");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchTags();
    return () => {
      mounted = false;
    };
  }, []);

  function handleTagClick(tag) {
    // ensure tag is a safe string
    const tagText = typeof tag === "string" ? tag : JSON.stringify(tag);
    router.push(`/events?tag=${encodeURIComponent(tagText)}`);
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-teal-600 bg-clip-text text-transparent">
        Tags
      </h1>

      {loading && <p>Loading tags…</p>}
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}

      <div className="flex flex-wrap gap-4">
        {tags.map((tag, i) => (
          <button
            key={`${String(tag)}-${i}`}
            onClick={() => handleTagClick(tag)}
            aria-label={`Filter by ${tag}`}
          >
            {/* Tag expects prop "text" (safe string) */}
            <Tag text={String(tag)} />
          </button>
        ))}
      </div>

      {!loading && tags.length === 0 && !error && (
        <p className="mt-4">No tags found.</p>
      )}
    </main>
  );
}
