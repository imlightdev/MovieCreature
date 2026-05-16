"use client";

import { useMemo, useState } from "react";
import { useDashboard } from "@/lib/useDashboard";
import type { Channel, MovieEnriched, User } from "@/lib/supabase";
import StatCard from "@/components/StatCard";
import MovieTable from "@/components/MovieTable";
import MovieFilters, {
  type FilterOption,
  type MovieFilters as TMovieFilters,
} from "@/components/MovieFilters";

type Props = {
  initialUsers: User[];
  initialChannels: Channel[];
  initialMovies: MovieEnriched[];
};

export default function Dashboard({
  initialUsers,
  initialChannels,
  initialMovies,
}: Props) {
  const { users, movies, connected, lastUpdate } = useDashboard({
    users: initialUsers,
    channels: initialChannels,
    movies: initialMovies,
  });

  // State filter
  const [filters, setFilters] = useState<TMovieFilters>({
    users: [],
    channels: [],
    titles: []
  });

  // Options for the select filters (derived from live data)
  const userOptions: FilterOption[] = useMemo(
    () => users.map((u) => ({ value: String(u.id), label: u.username })),
    [users]
  );

  const channelOptions: FilterOption[] = useMemo(
    () =>
      Array.from(
        new Map(
          movies.map((m) => [m.channel_id, m.channel_name])
        ).entries()
      ).map(([id, name]) => ({ value: String(id), label: name })),
    [movies]
  );

  const titleOptions: FilterOption[] = useMemo(
    () =>
      movies
        .filter((m) => m.title)
        .map((m) => ({ value: String(m.id), label: m.title! }))
        .filter(
          (opt, idx, arr) =>
            arr.findIndex((o) => o.label === opt.label) === idx
        ),
    [movies]
  );

  // Filters
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      if (
        filters.users.length > 0 &&
        !filters.users.some((f) => f.value === String(m.user_id))
      )
        return false;
      if (
        filters.channels.length > 0 &&
        !filters.channels.some((f) => f.value === String(m.channel_id))
      )
        return false;
      if (
        filters.titles.length > 0 &&
        !filters.titles.some((f) => f.value === String(m.id))
      )
        return false;
      return true;
    });
  }, [movies, filters]);

  const movieCounts: Record<number, number> = {};
  for (const m of movies) {
    movieCounts[m.user_id] = (movieCounts[m.user_id] ?? 0) + 1;
  }

  return (
    <>
      <div className="page">
        {/* Stats 
        <section className="stats-grid">
          <StatCard label="Total Requests" value={movies.length} />
          <StatCard
            label="Completed"
            value={streamedCount}
            sub={`${Math.round((streamedCount / movies.length) * 100) || 0}% of the total`}
          />
          <StatCard label="Pending" value={pendingCount} />
          <StatCard label="Users" value={activeUsers} />
        </section>*/}

        {/* Movie table */}
        <section className="section">

          {/* Filters */}
          <MovieFilters
            userOptions={userOptions}
            channelOptions={channelOptions}
            titleOptions={titleOptions}
            filters={filters}
            onChange={setFilters}
            activeCount={filteredMovies.length}
            totalCount={movies.length}
          />

          <MovieTable movies={filteredMovies} />
        </section>
      </div>

      <footer>
        <span className={`status-dot ${connected ? "on" : "off"}`} />
        <span>{connected ? "Realtime" : "Connection..."}</span>
        {lastUpdate && (
          <>
            <span className="dot-sep">·</span>
            <span>
              Ultimo aggiornamento:{" "}
              {lastUpdate.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </>
        )}
      </footer>
    </>
  );
}
