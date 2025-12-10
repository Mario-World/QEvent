// components/Header.jsx
"use client";

import "../app/globals.css";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import { CgProfile } from "react-icons/cg";
import { useSession, signIn, signOut } from "next-auth/react";

import { TfiTicket } from "react-icons/tfi";

const Header = () => {
  const { data: session, status } = useSession();
  const loggedIn = !!session;

  return (
    <nav className="drop-shadow-2xl flex items-center justify-between p-3 border-b border-slate-200 bg-slate-100 h-24">
      <div className="flex items-center gap-2">
        <Link href={"/"}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src={"/images/logo.png"}
              alt="logo"
              height={60}
              width={60}
              className="object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-teal-600 bg-clip-text text-transparent">
              QEvent
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 font-semibold">
          <Link
            href={"/"}
            className="flex items-center gap-2 hover:text-primary hover:scale-105 transition-all"
          >
            <HomeIcon />
            <span>Home</span>
          </Link>

          <Link
            href={"/events"}
            className="flex items-center gap-2 hover:text-primary hover:scale-105 transition-all"
          >
            <CgProfile />
            <span>Events</span>
          </Link>

          <Link
            href={"/artists"}
            className="flex items-center gap-2 hover:text-primary hover:scale-105 transition-all"
          >
            <PersonIcon />
            <span>Artists</span>
          </Link>

          <Link
            href={"/tags"}
            className="flex items-center gap-2 hover:text-primary hover:scale-105 transition-all"
          >
            <TfiTicket />
            <span>Tags</span>
          </Link>

          {/* Create Event visible only if logged in */}
          {loggedIn && (
            <Link
              href={"/create-event"}
              className="flex items-center gap-2 hover:text-primary hover:scale-105 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Create Event</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* When not logged in: show Log in (Google) */}
          {!loggedIn && (
            <button
              onClick={() => signIn("google")}
              className="bg-gradient-to-r from-orange-400 to-teal-600 text-white px-4 py-2 rounded-md font-medium hover:opacity-90"
            >
              Log in
            </button>
          )}

          {/* When logged in: show Logout + (optionally) avatar */}
          {loggedIn && (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/events" })}
                className="bg-gradient-to-r from-orange-400 to-teal-600 text-white px-4 py-2 rounded-md font-medium hover:opacity-90"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
