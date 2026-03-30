import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
  },
});

// Types
export type User = {
  id: number;
  name: string;
  enabled: number;
  created_at: string;
  updated_at: string | null;
};

export type Conductor = {
  id: number;
  name: string; 
  enabled: number;
  created_at: string;
  updated_at: string | null;
};

export type MovieReq = {
  id: number;
  title: string | null;
  imdb_id: string;
  imdb_link: string;
  user_id: number;
  conductor_id: number | null;
  f_streamed: number;
  created_at: string;
  updated_at: string | null;
};

// Enriched type for display (with joined names)
export type MovieReqEnriched = MovieReq & {
  user_name: string;
  conductor_name: string;
};

// Enriches raw movies with user/conductor names
export function enrichMovies(
  movies: MovieReq[],
  users: User[],
  conductors: Conductor[]
): MovieReqEnriched[] {
  const usersMap = new Map(users.map((u) => [u.id, u.name]));
  const conductorsMap = new Map(conductors.map((u) => [u.id, u.name]));
  const res = movies
  .filter((m) => m.f_streamed !== 2)
  .map((m) => {
    return {
      ...m,
      user_name: usersMap.get(m.user_id) ?? "—",
      conductor_name: m.conductor_id ? conductorsMap.get(m.conductor_id) ?? "—" : "—",
    };
  });
  return [...res].sort((a, b) => a.id - b.id);
}

// Fetch all data with joins
export async function fetchDashboardData() {
  const [usersRes, conductorsRes, moviesRes] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("conductors").select("*"),
    supabase.from("movie_req").select("*")
  ]);

  if (usersRes.error) throw usersRes.error;
  if (conductorsRes.error) throw conductorsRes.error;
  if (moviesRes.error) throw moviesRes.error;

  const users: User[] = usersRes.data ?? [];
  const conductors: Conductor[] = conductorsRes.data ?? [];
  const movies: MovieReq[] = moviesRes.data ?? [];
  console.log(moviesRes);
  return { users, conductors, movies: enrichMovies(movies, users, conductors) };
}
