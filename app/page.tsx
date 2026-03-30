import { fetchDashboardData } from "@/lib/supabase";
import TabLayout from "@/components/TabLayout";

export default async function Home() {
  let data;
  let error: string | null = null;

  try {
    data = await fetchDashboardData();
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
  <main>
    <header>
      <div className="header-inner">
        <div className="wordmark">
          <span className="wordmark-serif">Movie</span>
          <span className="wordmark-mono">Requests</span>
        </div>
      </div>
    </header>

    <TabLayout
      initialUsers={data.users}
      initialConductors={data.conductors}
      initialMovies={data.movies}
    />
  </main>
  );
}
