import { MovieReqEnriched } from "@/lib/supabase";

type Props = {
  movies: MovieReqEnriched[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MovieTable({ movies }: Props) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Requested by</th>
            <th>Conductor</th>
            <th>Status</th>
            <th>Date</th>
            <th>IMDB</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m, i) => (
            <tr key={m.id} className={m.f_streamed ? "streamed" : ""}>
              <td className="col-num">{m.id}</td>
              <td className="col-title">
                {m.title || <span className="no-title">N/D</span>}
              </td>
              <td className="col-user">{m.user_name}</td>
              <td className="col-conductor">{m.conductor_name}</td>
              <td>
                <span className={`badge ${m.f_streamed ? "badge-done" : "badge-pending"}`}>
                  {m.f_streamed ? "Completed" : "Pending"}
                </span>
              </td>
              <td className="col-date">{formatDate(m.created_at)}</td>
              <td>
                <a
                  href={m.imdb_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="imdb-link"
                >
                  {m.imdb_id}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 10L10 2M10 2H4M10 2V8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
