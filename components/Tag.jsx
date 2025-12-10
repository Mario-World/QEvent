// components/Tag.jsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Tag = ({ text }) => {
  const router = useRouter();

  const handleClick = () => {
    // navigate to /events?tag=TagName
    router.push(`/events?tag=${encodeURIComponent(text)}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="bg-gradient-to-r from-orange-400 to-teal-600 text-white rounded-2xl w-fit px-3 py-1 text-center font-bold hover:scale-110 hover:cursor-pointer"
    >
      # {text}
    </div>
  );
};

export default Tag;
