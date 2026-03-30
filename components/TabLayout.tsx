"use client";

import { useState } from "react";
import type { Conductor, MovieReqEnriched, User } from "@/lib/supabase";
import Dashboard from "@/components/Dashboard";
import Manual from "@/components/Manual";

type Tab = "requests" | "manual";

type Props = {
  initialUsers: User[];
  initialConductors: Conductor[];
  initialMovies: MovieReqEnriched[];
};

export default function TabLayout({ initialUsers, initialConductors, initialMovies }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("requests");

  return (
    <>
      <nav className="tab-nav">
        <div className="tab-nav-inner">
          <button
            className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Movie Requests
          </button>
          {/*
          <button
            className={`tab-btn ${activeTab === "manual" ? "active" : ""}`}
            onClick={() => setActiveTab("manual")}
          >
            Manual
          </button>
          */}
        </div>
      </nav>

      {activeTab === "requests" && (
        <Dashboard
          initialUsers={initialUsers}
          initialConductors={initialConductors}
          initialMovies={initialMovies}
        />
      )}
      {activeTab === "manual" && <Manual />}
    </>
  );
}