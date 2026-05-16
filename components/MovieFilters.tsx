"use client";

import Select, { StylesConfig, MultiValue } from "react-select";

export type FilterOption = { value: string; label: string };

export type MovieFilters = {
  users: FilterOption[];
  channels: FilterOption[];
  titles: FilterOption[],
};

type Props = {
  userOptions: FilterOption[];
  channelOptions: FilterOption[];
  titleOptions: FilterOption[];
  filters: MovieFilters;
  onChange: (filters: MovieFilters) => void;
  activeCount: number;
  totalCount: number;
};

// Stile react-select
function buildStyles(accent = false): StylesConfig<FilterOption, true> {
  return {
    control: (base, state) => ({
      ...base,
      background: "var(--surface-2)",
      borderColor: state.isFocused
        ? "var(--gold)"
        : accent
        ? "var(--border-accent)"
        : "var(--border)",
      borderRadius: "2px",
      boxShadow: state.isFocused ? "0 0 0 1px var(--gold)" : "none",
      minHeight: "36px",
      fontSize: "0.8rem",
      cursor: "text",
      "&:hover": { borderColor: "var(--gold)" },
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--text-dim)",
      fontSize: "0.75rem",
      letterSpacing: "0.04em",
    }),
    input: (base) => ({
      ...base,
      color: "var(--text)",
      fontSize: "0.8rem",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "2px 10px",
      gap: "4px",
    }),
    multiValue: (base) => ({
      ...base,
      background: "rgba(218, 165, 90, 0.12)",
      border: "1px solid rgba(218, 165, 90, 0.3)",
      borderRadius: "1px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "var(--gold-light)",
      fontSize: "0.72rem",
      padding: "1px 4px",
      fontFamily: "'DM Mono', monospace",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "var(--gold)",
      cursor: "pointer",
      borderRadius: "0 1px 1px 0",
      "&:hover": {
        background: "rgba(218, 165, 90, 0.2)",
        color: "var(--gold-light)",
      },
    }),
    menu: (base) => ({
      ...base,
      background: "var(--surface-2)",
      border: "1px solid var(--border-accent)",
      borderRadius: "2px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      zIndex: 50,
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected
        ? "rgba(218, 165, 90, 0.15)"
        : state.isFocused
        ? "rgba(255,255,255,0.04)"
        : "transparent",
      color: state.isSelected ? "var(--gold-light)" : "var(--text)",
      fontSize: "0.8rem",
      borderRadius: "1px",
      padding: "6px 10px",
      cursor: "pointer",
      "&:active": { background: "rgba(218, 165, 90, 0.2)" },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: "var(--text-dim)",
      fontSize: "0.75rem",
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "var(--text-dim)",
      padding: "4px",
      cursor: "pointer",
      "&:hover": { color: "var(--text-muted)" },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "var(--text-dim)",
      padding: "4px 8px",
      "&:hover": { color: "var(--text-muted)" },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      background: "var(--border)",
    }),
  };
}

export default function MovieFilters({
  userOptions,
  channelOptions,
  titleOptions,
  filters,
  onChange,
  activeCount,
  totalCount,
}: Props) {
  const hasActiveFilters =
    filters.users.length > 0 ||
    filters.channels.length > 0 ||
    filters.titles.length > 0
    ;

  function handleReset() {
    onChange({ users: [], channels: [], titles: []});
  }

  return (
    <div className="filters-wrapper">
      <div className="filters-row">
        {/* User */}
        <div className="filter-col">
          <label className="filter-label">Users</label>
          <Select
            isMulti
            options={userOptions}
            value={filters.users}
            onChange={(v: MultiValue<FilterOption>) =>
              onChange({ ...filters, users: [...v] })
            }
            placeholder="All users..."
            styles={buildStyles()}
            noOptionsMessage={() => "No results found"}
            instanceId="filter-users"
          />
        </div>

        {/* Channel */}
        <div className="filter-col">
          <label className="filter-label">Channels</label>
          <Select
            isMulti
            options={channelOptions}
            value={filters.channels}
            onChange={(v: MultiValue<FilterOption>) =>
              onChange({ ...filters, channels: [...v] })
            }
            placeholder="All channels..."
            styles={buildStyles()}
            noOptionsMessage={() => "No results found"}
            instanceId="filter-channels"
          />
        </div>

        {/* Title */}
        <div className="filter-col">
          <label className="filter-label">Title</label>
          <Select
            isMulti
            options={titleOptions}
            value={filters.titles}
            onChange={(v: MultiValue<FilterOption>) =>
              onChange({ ...filters, titles: [...v] })
            }
            placeholder="All titles..."
            styles={buildStyles(true)}
            noOptionsMessage={() => "No results found"}
            instanceId="filter-titles"
          />
        </div>
      </div>

      {/* Footer filters */}
      <div className="filters-footer">
        <span className="filters-count">
          {hasActiveFilters ? (
            <>
              <span className="count-active">{activeCount}</span>
              <span className="count-sep"> / </span>
              <span>{totalCount}</span>
              <span className="count-label"> results</span>
            </>
          ) : (
            <span className="count-label">{totalCount} total requests</span>
          )}
        </span>
        {hasActiveFilters && (
          <button className="reset-btn" onClick={handleReset}>
            ✕ reset filters
          </button>
        )}
      </div>

      <style jsx>{`
        .filters-wrapper {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: 1px solid var(--border-accent);
          padding: 1.25rem 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          position: relative;
        }
        .filters-wrapper::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.4;
        }
        .filters-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }
        .filter-col {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .filter-label {
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-dim);
          font-weight: 500;
          font-family: 'DM Mono', monospace;
        }
        .filters-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border);
        }
        .filters-count {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .count-active {
          color: var(--gold-light);
          font-weight: 500;
        }
        .count-sep {
          color: var(--text-dim);
        }
        .count-label {
          color: var(--text-dim);
        }
        .reset-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-dim);
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          padding: 0.25rem 0.6rem;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s;
        }
        .reset-btn:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        @media (max-width: 640px) {
          .filters-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
