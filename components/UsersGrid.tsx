import { User } from "@/lib/supabase";

type Props = {
  users: User[];
  movieCounts: Record<number, number>;
};

export default function UsersGrid({ users, movieCounts }: Props) {
  return (
    <div className="users-grid">
      {users.map((u) => (
        <div key={u.id} className={`user-card ${u.enabled ? "" : "disabled"}`}>
          <div className="user-avatar">
            {u.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{u.name}</span>
            <span className="user-count">
              {movieCounts[u.id] ?? 0} richieste
            </span>
          </div>
          <div className={`user-status-dot ${u.enabled ? "active" : "inactive"}`} />
        </div>
      ))}
    </div>
  );
}
