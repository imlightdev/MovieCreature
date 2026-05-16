"use client";

import { useEffect, useRef, useState } from "react";
import {
  supabase,
  enrichMovies,
  type Channel,
  type Movie,
  type MovieEnriched,
  type User,
} from "@/lib/supabase";

export type DashboardState = {
  users: User[];
  channels: Channel[];
  movies: MovieEnriched[];
  connected: boolean;
  lastUpdate: Date | null;
};

type InitialData = {
  users: User[];
  channels: Channel[];
  movies: MovieEnriched[];
};

export function useDashboard(initial: InitialData): DashboardState {
  const [users, setUsers] = useState<User[]>(initial.users);
  const [channels, setChannels] = useState<Channel[]>(initial.channels);
  const [rawMovies, setRawMovies] = useState<Movie[]>(
    // strip enriched fields to get back raw movies
    initial.movies.map(({ user_name, channel_name, ...m }) => m)
  );
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Keep refs so realtime callbacks always see fresh state
  const usersRef = useRef(users);
  const channelsRef = useRef(channels);
  const rawMoviesRef = useRef(rawMovies);
  useEffect(() => { usersRef.current = users; }, [users]);
  useEffect(() => { channelsRef.current = channels; }, [channels]);
  useEffect(() => { rawMoviesRef.current = rawMovies; }, [rawMovies]);

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")

      // ── USERS ──────────────────────────────────────────────
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        (payload) => {
          setUsers((prev) => [...prev, payload.new as User].sort((a, b) => a.username.localeCompare(b.username)));
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload) => {
          setUsers((prev) =>
            prev.map((u) => (u.id === (payload.new as User).id ? (payload.new as User) : u))
          );
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "users" },
        (payload) => {
          setUsers((prev) => prev.filter((u) => u.id !== (payload.old as User).id));
          setLastUpdate(new Date());
        }
      )

      // ── CHANNELS ─────────────────────────────────────────
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "channels" },
        (payload) => {
          setChannels((prev) => [...prev, payload.new as Channel]);
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "channels" },
        (payload) => {
          setChannels((prev) =>
            prev.map((c) =>
              c.id === (payload.new as Channel).id ? (payload.new as Channel) : c
            )
          );
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "channels" },
        (payload) => {
          setChannels((prev) => prev.filter((c) => c.id !== (payload.old as Channel).id));
          setLastUpdate(new Date());
        }
      )

      // ── MOVIES ──────────────────────────────────────────
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "movies" },
        (payload) => {
          setRawMovies((prev) => [payload.new as Movie, ...prev]);
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "movie_req" },
        (payload) => {
          setRawMovies((prev) =>
            prev.map((m) =>
              m.id === (payload.new as Movie).id ? (payload.new as Movie) : m
            )
          );
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "movie_req" },
        (payload) => {
          setRawMovies((prev) => prev.filter((m) => m.id !== (payload.old as Movie).id));
          setLastUpdate(new Date());
        }
      )

      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Re-enrich every time raw data or lookup tables change
  const movies = enrichMovies(rawMovies, users, channels);

  return { users, channels, movies, connected, lastUpdate };
}
