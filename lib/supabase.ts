import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
  },
});

// Types
export enum RolesEnum {
  ADMIN = 1,
  CONDUCTOR = 2,
  CREATURE = 3
}

export enum StreamedEnum {
  PENDING = 0,
  LIVE = 1,
  COMPLETED = 2,
  CANCELED = 3
}

export interface User {
  id: number;
  username: string;
  role_id: number;
  enabled: number;
  created_at: string;
  updated_at: string | null;
}

export interface Channel {
  id: number;
  name: string;
  link: string;
  user_id: number;
  created_at: string;
  updated_at: string | null; 
}

export interface Movie {
  id: number;
  title: string;
  imdb_id: string | null;
  imdb_link: string | null;
  user_id: number;
  channel_id: number | null;
  f_requested: number;
  f_scheduled: number;
  f_streamed: number;
  created_at: string;
  updated_at: string | null;
}


export type User = {
  id: number;
  username: string;
  role_id: number;
  enabled: number;
  created_at: string;
  updated_at: string | null;
};

// Enriched type for display (with joined names)
export type MovieEnriched = Movie & {
  username: string;
  channel_name: string;
};

// Enriches raw movies with user/conductor names
export function enrichMovies(
  movies: Movie[],
  users: User[],
  channels: Channel[]
): MovieEnriched[] {
  const usersMap = new Map(users.map((u) => [u.id, u.username]));
  const channelsMap = new Map(channels.map((u) => [u.id, u.name]));
  const res = movies
  .map((m) => {
    return {
      ...m,
      user_name: usersMap.get(m.user_id) ?? "—",
      channel_name: m.channel_id ? channelsMap.get(m.channel_id) ?? "—" : "—",
    };
  });
  return [...res].sort((a, b) => a.id - b.id);
}

// Fetch all data with joins
export async function fetchDashboardData(streamed: number) {

  const { data: usersRes, error: usersError } = await supabase
    .from("users")
    .select("*");

  if (usersError) throw new Error(`Error users find: ${usersError.message}`);

  const { data: channelsRes, error: channelsError } = await supabase
    .from("channels")
    .select("*");

  if (channelsError) throw new Error(`Error channels find: ${channelsError.message}`);

  const { data: moviesRes, error: moviesError } = await supabase
    .from("movies")
    .select("*")
    .eq('f_streamed', streamed);

  if (moviesError) throw new Error(`Error movies find: ${moviesError.message}`);

  const users: User[] = usersRes as User[];
  const channels: Channel[] = channelsRes as Channel[];
  const movies: Movie[] = moviesRes as Movie[]; 
  const moviesEnrich = enrichMovies(movies, users, channels);

  console.log(moviesEnrich);
  return { users, channels, movies: moviesEnrich };
}