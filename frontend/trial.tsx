import { useMemo, useState } from "react";
import {
  LuFlaskConical,
  LuPlay,
  LuHourglass,
  LuCalendarX,
  LuSearch,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
import {
  type TrialUser,
  getDaysLeft,
  getEndDate,
  formatDate,
  formatISODate,
  toISO,
} from "./trialData";
import "./trial.css";

type Props = {
  trials: TrialUser[];
  onAdd: (u: Omit<TrialUser, "id">) => void;
  onExtend: (id: number, extra: number) => void;
  onRemove: (id: number) => void;
};

const QUICK_DAYS = [1, 3, 7, 14, 30];

export default function Trial({ trials, onAdd, onExtend, onRemove }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [days, setDays] = useState("3");
  const [startDate, setStartDate] = useState(toISO(new Date()));
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const d = Number(days);
    if (!name.trim()) return setError("User ka naam likho");
    if (!d || d < 1) return setError("Din kam az kam 1 hone chahiye");
    setError("");
    onAdd({ name: name.trim(), phone: phone.trim(), start_date: startDate, days: d });
    setName("");
    setPhone("");
    setDays("3");
    setStartDate(toISO(new Date()));
  };

  const extend = (t: TrialUser) => {
    const val = window.prompt(`${t.name} ka trial kitne din barhana hai?`, "3");
    if (val === null) return;
    const n = Number(val);
    if (!n || n < 1) return;
    onExtend(t.id, n);
  };

  const remove = (t: TrialUser) => {
    if (window.confirm(`${t.name} ko trial list se hata dein?`)) onRemove(t.id);
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return trials
      .filter((t) => !q || t.name.toLowerCase().includes(q) || t.phone.toLowerCase().includes(q))
      .map((t) => ({ t, left: getDaysLeft(t) }))
      .sort((a, b) => a.left - b.left);
  }, [trials, search]);

  const running = trials.filter((t) => getDaysLeft(t) > 1).length;
  const expiring = trials.filter((t) => {
    const l = getDaysLeft(t);
    return l >= 0 && l <= 1;
  }).length;
  const expired = trials.filter((t) => getDaysLeft(t) < 0).length;

  return (
    <div className="trial-page">
      {/* Header */}
      <div className="trial-header">
        <h1 className="trial-title">Trial Users</h1>
        <p className="trial-subtitle">
          Jin ko abhi try ke liye software diya hai, har user ke din alag set karo
        </p>
      </div>

      {/* KPI cards */}
      <div className="trial-cards">
        <div className="trial-card">
          <div className="trial-icon trial-icon-amber">
            <LuFlaskConical size={24} />
          </div>
          <div className="trial-card-body">
            <span className="trial-card-label">Total Trials</span>
            <span className="trial-card-value">{trials.length}</span>
            <span className="trial-card-note">Ab tak diye gaye trials</span>
          </div>
        </div>

        <div className="trial-card">
          <div className="trial-icon trial-icon-green">
            <LuPlay size={24} />
          </div>
          <div className="trial-card-body">
            <span className="trial-card-label">Running</span>
            <span className="trial-card-value trial-green">{running}</span>
            <span className="trial-card-note">Abhi chal rahe hain</span>
          </div>
        </div>

        <div className="trial-card">
          <div className="trial-icon trial-icon-orange">
            <LuHourglass size={24} />
          </div>
          <div className="trial-card-body">
            <span className="trial-card-label">Expiring (1 din)</span>
            <span className="trial-card-value trial-orange">{expiring}</span>
            <span className="trial-card-note">Jald khatam hone wale</span>
          </div>
        </div>

        <div className="trial-card">
          <div className="trial-icon trial-icon-red">
            <LuCalendarX size={24} />
          </div>
          <div className="trial-card-body">
            <span className="trial-card-label">Expired</span>
            <span className="trial-card-value trial-red">{expired}</span>
            <span className="trial-card-note">Trial khatam ho chuka</span>
          </div>
        </div>
      </div>

      {/* Add trial panel */}
      <div className="trial-panel">
        <div className="trial-panel-head">
          <div>
            <h2 className="trial-panel-title">Naya Trial Do</h2>
            <p className="trial-panel-sub">Naam, phone aur din likh kar trial shuru karo</p>
          </div>
        </div>

        <div className="trial-form">
          <input
            className="trial-input"
            placeholder="User / Shop ka naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="trial-input"
            placeholder="Phone (0300-1234567)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="trial-input"
            type="number"
            min={1}
            placeholder="Din"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
          <input
            className="trial-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <button className="trial-btn-primary" onClick={submit}>
            <LuPlus size={16} />
            Trial Do
          </button>
        </div>

        <div className="trial-quick">
          <span>Jaldi select:</span>
          {QUICK_DAYS.map((d) => (
            <button
              key={d}
              className={`trial-chip ${Number(days) === d ? "trial-chip-active" : ""}`}
              onClick={() => setDays(String(d))}
            >
              {d} din
            </button>
          ))}
        </div>

        {error && <div className="trial-error">{error}</div>}
      </div>

      {/* List panel */}
      <div className="trial-panel">
        <div className="trial-panel-head">
          <div>
            <h2 className="trial-panel-title">Trial List ({rows.length})</h2>
            <p className="trial-panel-sub">Sab se pehle khatam hone wale upar</p>
          </div>
          <div className="trial-search-wrap">
            <LuSearch size={16} />
            <input
              className="trial-search"
              placeholder="Search name ya phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="trial-table-wrap">
          <table className="trial-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Start</th>
                <th>Din Diye</th>
                <th>End Date</th>
                <th>Bache Din</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="trial-empty">
                    Koi trial user nahi mila
                  </td>
                </tr>
              ) : (
                rows.map(({ t, left }, i) => {
                  const status = left < 0 ? "expired" : left <= 1 ? "expiring" : "running";
                  return (
                    <tr key={t.id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="trial-user">{t.name}</div>
                        <div className="trial-phone">{t.phone || "-"}</div>
                      </td>
                      <td>{formatISODate(t.start_date)}</td>
                      <td>{t.days} din</td>
                      <td>{formatDate(getEndDate(t))}</td>
                      <td className="trial-left">
                        {left < 0 ? "-" : left === 0 ? "Aaj last din" : `${left} din`}
                      </td>
                      <td>
                        <span className={`trial-badge trial-badge-${status}`}>
                          {status === "expired" ? "Expired" : status === "expiring" ? "Expiring" : "Running"}
                        </span>
                      </td>
                      <td>
                        <div className="trial-actions">
                          <button className="trial-btn-sm" onClick={() => extend(t)}>
                            <LuPlus size={14} />
                            Extend
                          </button>
                          <button className="trial-btn-sm trial-btn-danger" onClick={() => remove(t)}>
                            <LuTrash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}