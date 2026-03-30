"use client";

import { useEffect, useRef, useState } from "react";
import {
  supabase,
  enrichMovies,
  type Conductor,
  type MovieReq,
  type MovieReqEnriched,
  type User,
} from "@/lib/supabase";

export type DashboardState = {
  users: User[];
  conductors: Conductor[];
  movies: MovieReqEnriched[];
  connected: boolean;
  lastUpdate: Date | null;
};

type InitialData = {
  users: User[];
  conductors: Conductor[];
  movies: MovieReqEnriched[];
};

export function useDashboard(initial: InitialData): DashboardState {
  const [users, setUsers] = useState<User[]>(initial.users);
  const [conductors, setConductors] = useState<Conductor[]>(initial.conductors);
  const [rawMovies, setRawMovies] = useState<MovieReq[]>(
    // strip enriched fields to get back raw movies
    initial.movies.map(({ user_name, conductor_name, ...m }) => m)
  );
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Keep refs so realtime callbacks always see fresh state
  const usersRef = useRef(users);
  const conductorsRef = useRef(conductors);
  const rawMoviesRef = useRef(rawMovies);
  useEffect(() => { usersRef.current = users; }, [users]);
  useEffect(() => { conductorsRef.current = conductors; }, [conductors]);
  useEffect(() => { rawMoviesRef.current = rawMovies; }, [rawMovies]);

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")

      // ── USERS ──────────────────────────────────────────────
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        (payload) => {
          setUsers((prev) => [...prev, payload.new as User].sort((a, b) => a.name.localeCompare(b.name)));
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

      // ── CONDUCTORS ─────────────────────────────────────────
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "conductors" },
        (payload) => {
          setConductors((prev) => [...prev, payload.new as Conductor]);
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conductors" },
        (payload) => {
          setConductors((prev) =>
            prev.map((c) =>
              c.id === (payload.new as Conductor).id ? (payload.new as Conductor) : c
            )
          );
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "conductors" },
        (payload) => {
          setConductors((prev) => prev.filter((c) => c.id !== (payload.old as Conductor).id));
          setLastUpdate(new Date());
        }
      )

      // ── MOVIE_REQ ──────────────────────────────────────────
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "movie_req" },
        (payload) => {
          setRawMovies((prev) => [payload.new as MovieReq, ...prev]);
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "movie_req" },
        (payload) => {
          setRawMovies((prev) =>
            prev.map((m) =>
              m.id === (payload.new as MovieReq).id ? (payload.new as MovieReq) : m
            )
          );
          setLastUpdate(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "movie_req" },
        (payload) => {
          setRawMovies((prev) => prev.filter((m) => m.id !== (payload.old as MovieReq).id));
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
  const movies = enrichMovies(rawMovies, users, conductors);

  return { users, conductors, movies, connected, lastUpdate };
}
