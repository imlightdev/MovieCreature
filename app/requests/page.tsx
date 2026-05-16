import { fetchDashboardData, StreamedEnum } from "@/lib/supabase";
import Dashboard from "@/components/Dashboard";
import TabLayout from "@/components/TabLayout";

export default async function Home() {
  let data;
  let error: string | null = null;

  try {
    data = await fetchDashboardData(StreamedEnum.PENDING);
  } catch (e) {
    error = (e as Error).message;
  }

  if (error || !data) {
    return (
      <main className="error-state">
        <p>⚠ Errore nel caricamento: {error}</p>
      </main>
    );
  }

  return (
      <Dashboard
        initialUsers={data.users}
        initialChannels={data.channels}
        initialMovies={data.movies}
      />
  );
}