import { useMemo, useState } from "react";
import {
  LuUsers,
  LuBadgeCheck,
  LuWallet,
  LuDownload,
  LuHourglass,
  LuTrendingUp,
  LuCalendar,
} from "react-icons/lu";
import "./dashboard.css";

type Subscription = {
  id: number;
  client_name: string;
  phone: string;
  plan: string;
  total_amount: number;
  paid_amount: number;
  start_date: string;
  end_date: string;
};

type PayState = "paid" | "partial" | "unpaid";
type SubStatus = "active" | "expiring" | "expired";

const DATA: Subscription[] = [
  { id: 1, client_name: "Ali Traders", phone: "0300-1111111", plan: "Yearly", total_amount: 60000, paid_amount: 60000, start_date: "2026-06-10", end_date: "2027-06-10" },
  { id: 2, client_name: "Hassan Electronics", phone: "0301-2222222", plan: "6 Months", total_amount: 35000, paid_amount: 20000, start_date: "2026-06-18", end_date: "2026-12-18" },
  { id: 3, client_name: "Noor Mart", phone: "0302-3333333", plan: "Monthly", total_amount: 5000, paid_amount: 0, start_date: "2026-10-05", end_date: "2026-11-05" },
  { id: 4, client_name: "City Pharmacy", phone: "0303-4444444", plan: "Yearly", total_amount: 60000, paid_amount: 45000, start_date: "2026-07-15", end_date: "2027-07-15" },
  { id: 5, client_name: "Bilal Store", phone: "0304-5555555", plan: "Monthly", total_amount: 5000, paid_amount: 5000, start_date: "2026-10-20", end_date: "2026-11-20" },
  { id: 6, client_name: "Usman Garments", phone: "0305-6666666", plan: "6 Months", total_amount: 35000, paid_amount: 35000, start_date: "2026-08-01", end_date: "2027-02-01" },
  { id: 7, client_name: "Fresh Bakers", phone: "0306-7777777", plan: "Monthly", total_amount: 5000, paid_amount: 2500, start_date: "2026-10-28", end_date: "2026-11-28" },
  { id: 8, client_name: "Zain Autos", phone: "0307-8888888", plan: "Yearly", total_amount: 60000, paid_amount: 30000, start_date: "2026-08-12", end_date: "2027-08-12" },
  { id: 9, client_name: "Rehman Mobiles", phone: "0308-9999999", plan: "6 Months", total_amount: 35000, paid_amount: 35000, start_date: "2026-09-03", end_date: "2027-03-03" },
  { id: 10, client_name: "Iqra Boutique", phone: "0309-1212121", plan: "Monthly", total_amount: 5000, paid_amount: 5000, start_date: "2026-11-02", end_date: "2026-12-02" },
  { id: 11, client_name: "Madina General Store", phone: "0310-3434343", plan: "Yearly", total_amount: 60000, paid_amount: 0, start_date: "2026-09-20", end_date: "2027-09-20" },
  { id: 12, client_name: "Shah Opticals", phone: "0311-5656565", plan: "6 Months", total_amount: 35000, paid_amount: 15000, start_date: "2026-11-01", end_date: "2027-05-01" },
];

const DAY = 24 * 60 * 60 * 1000;

const formatPKR = (n: number) => "Rs " + Math.round(n || 0).toLocaleString("en-PK");

const formatShort = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "k";
  return String(n);
};

const formatDate = (d: string) => {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const daysLeft = (end: string) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const e = new Date(end);
  const endDay = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
  return Math.round((endDay - today) / DAY);
};

const getSubStatus = (end: string): SubStatus => {
  const left = daysLeft(end);
  if (left < 0) return "expired";
  if (left <= 7) return "expiring";
  return "active";
};

const getPayState = (s: Subscription): PayState => {
  if (s.paid_amount >= s.total_amount) return "paid";
  if (s.paid_amount > 0) return "partial";
  return "unpaid";
};

const niceMax = (max: number) => {
  if (max <= 0) return 1000;
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / step) * step;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
};

// Chart geometry
const CW = 640;
const CH = 270;
const PAD_L = 52;
const PAD_R = 18;
const PAD_T = 18;
const PAD_B = 34;

export default function Dashboard() {
  const [hover, setHover] = useState<number | null>(null);

  const stats = useMemo(() => {
    const totalClients = DATA.length;
    const totalRevenue = DATA.reduce((a, s) => a + s.total_amount, 0);
    const received = DATA.reduce((a, s) => a + s.paid_amount, 0);
    const remaining = Math.max(totalRevenue - received, 0);
    const paid = DATA.filter((s) => getPayState(s) === "paid").length;
    const partial = DATA.filter((s) => getPayState(s) === "partial").length;
    const unpaid = DATA.filter((s) => getPayState(s) === "unpaid").length;
    const active = DATA.filter((s) => getSubStatus(s.end_date) !== "expired").length;
    const expired = totalClients - active;
    const percent = totalRevenue > 0 ? Math.round((received / totalRevenue) * 100) : 0;
    return { totalClients, totalRevenue, received, remaining, paid, partial, unpaid, active, expired, percent };
  }, []);

  const monthly = useMemo(() => {
    const now = new Date();
    const list: { key: string; label: string; billed: number; received: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      list.push({
        key,
        label: d.toLocaleDateString("en-GB", { month: "short" }),
        billed: 0,
        received: 0,
      });
    }
    DATA.forEach((s) => {
      const m = list.find((x) => x.key === s.start_date.slice(0, 7));
      if (m) {
        m.billed += s.total_amount;
        m.received += s.paid_amount;
      }
    });
    return list;
  }, []);

  const chart = useMemo(() => {
    const max = niceMax(Math.max(...monthly.map((m) => m.billed), 0));
    const innerW = CW - PAD_L - PAD_R;
    const innerH = CH - PAD_T - PAD_B;
    const x = (i: number) => PAD_L + (monthly.length === 1 ? innerW / 2 : (innerW / (monthly.length - 1)) * i);
    const y = (v: number) => PAD_T + innerH - (v / max) * innerH;
    const line = (key: "billed" | "received") =>
      monthly.map((m, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(m[key]).toFixed(1)}`).join(" ");
    const area = (key: "billed" | "received") =>
      `${line(key)} L${x(monthly.length - 1).toFixed(1)},${(PAD_T + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD_T + innerH).toFixed(1)} Z`;
    const ticks = [0, 1, 2, 3, 4].map((i) => ({ v: (max / 4) * i, y: y((max / 4) * i) }));
    return { x, y, line, area, ticks, innerH };
  }, [monthly]);

  const planStats = useMemo(() => {
    const map = new Map<string, { plan: string; count: number; total: number; received: number }>();
    DATA.forEach((s) => {
      const cur = map.get(s.plan) || { plan: s.plan, count: 0, total: 0, received: 0 };
      cur.count += 1;
      cur.total += s.total_amount;
      cur.received += s.paid_amount;
      map.set(s.plan, cur);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, []);

  const topDues = useMemo(
    () =>
      DATA.map((s) => ({ s, due: s.total_amount - s.paid_amount }))
        .filter((x) => x.due > 0)
        .sort((a, b) => b.due - a.due)
        .slice(0, 5),
    []
  );

  const expiringSoon = useMemo(
    () =>
      DATA.map((s) => ({ s, left: daysLeft(s.end_date) }))
        .filter((x) => x.left >= 0 && x.left <= 30)
        .sort((a, b) => a.left - b.left)
        .slice(0, 5),
    []
  );

  const recent = useMemo(
    () => [...DATA].sort((a, b) => b.start_date.localeCompare(a.start_date)).slice(0, 6),
    []
  );

  // Donut
  const R = 62;
  const C = 2 * Math.PI * R;
  const total = stats.totalClients || 1;
  const segs = [
    { key: "paid", label: "Fully Paid", value: stats.paid, color: "#22c55e" },
    { key: "partial", label: "Partial", value: stats.partial, color: "#fbbf24" },
    { key: "unpaid", label: "Unpaid", value: stats.unpaid, color: "#ef4444" },
  ];
  let offset = 0;
  const donut = segs.map((sg) => {
    const len = (sg.value / total) * C;
    const item = { ...sg, len, offset };
    offset += len;
    return item;
  });

  const maxPlan = Math.max(...planStats.map((p) => p.total), 1);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const hv = hover !== null ? monthly[hover] : null;

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">{getGreeting()}, Admin</h1>
          <p className="dash-subtitle">Aaj ka subscriptions aur revenue ka poora overview</p>
        </div>
        <div className="dash-date">
          <LuCalendar size={16} />
          <span>{today}</span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-icon dash-icon-amber">
            <LuUsers size={24} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">Total Clients</span>
            <span className="dash-card-value">{stats.totalClients}</span>
            <span className="dash-card-note">Jinhein software diya hai</span>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-icon dash-icon-teal">
            <LuBadgeCheck size={24} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">Active Subscriptions</span>
            <span className="dash-card-value">{stats.active}</span>
            <span className="dash-card-note">{stats.expired} expired</span>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-icon dash-icon-purple">
            <LuWallet size={24} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">Total Revenue</span>
            <span className="dash-card-value">{formatPKR(stats.totalRevenue)}</span>
            <span className="dash-card-note">Kul bill amount</span>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-icon dash-icon-green">
            <LuDownload size={24} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">Received</span>
            <span className="dash-card-value dash-green">{formatPKR(stats.received)}</span>
            <span className="dash-card-note">{stats.paid} clients ne poora pay kiya</span>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-icon dash-icon-red">
            <LuHourglass size={24} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">Remaining</span>
            <span className="dash-card-value dash-red">{formatPKR(stats.remaining)}</span>
            <span className="dash-card-note">{stats.partial + stats.unpaid} clients ki baqi hai</span>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-icon dash-icon-orange">
            <LuTrendingUp size={24} />
          </div>
          <div className="dash-card-body">
            <span className="dash-card-label">Collection Rate</span>
            <span className="dash-card-value">{stats.percent}%</span>
            <div className="dash-mini-bar">
              <div className="dash-mini-fill" style={{ width: `${stats.percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="dash-grid-2">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Revenue Trend</h2>
              <p className="dash-panel-sub">Pichle 6 mahine: billed vs received</p>
            </div>
            <div className="dash-legend">
              <span><i className="dash-dot dash-dot-amber" /> Billed</span>
              <span><i className="dash-dot dash-dot-green" /> Received</span>
            </div>
          </div>

          <div className="dash-chart-wrap">
            <svg className="dash-chart" viewBox={`0 0 ${CW} ${CH}`} onMouseLeave={() => setHover(null)}>
              <defs>
                <linearGradient id="gBilled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {chart.ticks.map((t, i) => (
                <g key={i}>
                  <line x1={PAD_L} x2={CW - PAD_R} y1={t.y} y2={t.y} className="dash-grid-line" />
                  <text x={PAD_L - 8} y={t.y + 4} textAnchor="end" className="dash-axis-text">
                    {formatShort(t.v)}
                  </text>
                </g>
              ))}

              <path d={chart.area("billed")} fill="url(#gBilled)" />
              <path d={chart.area("received")} fill="url(#gPaid)" />
              <path d={chart.line("billed")} className="dash-line dash-line-amber" />
              <path d={chart.line("received")} className="dash-line dash-line-green" />

              {hover !== null && (
                <line
                  x1={chart.x(hover)}
                  x2={chart.x(hover)}
                  y1={PAD_T}
                  y2={PAD_T + chart.innerH}
                  className="dash-hover-line"
                />
              )}

              {monthly.map((m, i) => (
                <g key={m.key}>
                  <circle cx={chart.x(i)} cy={chart.y(m.billed)} r={hover === i ? 6 : 4} className="dash-point dash-point-amber" />
                  <circle cx={chart.x(i)} cy={chart.y(m.received)} r={hover === i ? 6 : 4} className="dash-point dash-point-green" />
                  <text x={chart.x(i)} y={CH - 10} textAnchor="middle" className="dash-axis-text">
                    {m.label}
                  </text>
                  <rect
                    x={chart.x(i) - 30}
                    y={PAD_T}
                    width={60}
                    height={chart.innerH}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                  />
                </g>
              ))}
            </svg>

            <div className="dash-chart-info">
              {hv ? (
                <>
                  <strong>{hv.label}</strong>
                  <span>Billed: {formatPKR(hv.billed)}</span>
                  <span className="dash-green">Received: {formatPKR(hv.received)}</span>
                </>
              ) : (
                <span className="dash-hint">Chart pe mouse le jao, us mahine ki detail dikhegi</span>
              )}
            </div>
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Payment Status</h2>
              <p className="dash-panel-sub">Clients ki payment ki halat</p>
            </div>
          </div>

          <div className="dash-donut-wrap">
            <svg viewBox="0 0 180 180" className="dash-donut">
              <circle cx="90" cy="90" r={R} className="dash-donut-bg" />
              {donut.map((d) =>
                d.value > 0 ? (
                  <circle
                    key={d.key}
                    cx="90"
                    cy="90"
                    r={R}
                    fill="none"
                    stroke={d.color}
                    strokeWidth="22"
                    strokeDasharray={`${d.len} ${C - d.len}`}
                    strokeDashoffset={-d.offset}
                    transform="rotate(-90 90 90)"
                  />
                ) : null
              )}
              <text x="90" y="88" textAnchor="middle" className="dash-donut-num">
                {stats.totalClients}
              </text>
              <text x="90" y="106" textAnchor="middle" className="dash-donut-label">
                Clients
              </text>
            </svg>

            <div className="dash-donut-legend">
              {donut.map((d) => (
                <div key={d.key} className="dash-donut-row">
                  <span className="dash-donut-name">
                    <i className="dash-dot" style={{ background: d.color }} />
                    {d.label}
                  </span>
                  <span className="dash-donut-val">
                    {d.value} <small>({Math.round((d.value / total) * 100)}%)</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plans + Collection */}
      <div className="dash-grid-2 dash-grid-equal">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Plan-wise Revenue</h2>
              <p className="dash-panel-sub">Kis plan se kitna business aaya</p>
            </div>
          </div>
          <div className="dash-bars">
            {planStats.map((p) => (
              <div key={p.plan} className="dash-bar-row">
                <div className="dash-bar-top">
                  <span className="dash-bar-name">
                    {p.plan} <small>({p.count} clients)</small>
                  </span>
                  <span className="dash-bar-val">{formatPKR(p.total)}</span>
                </div>
                <div className="dash-bar-track" style={{ width: `${(p.total / maxPlan) * 100}%` }}>
                  <div
                    className="dash-bar-fill"
                    style={{ width: `${p.total > 0 ? (p.received / p.total) * 100 : 0}%` }}
                  />
                </div>
                <div className="dash-bar-note">Received {formatPKR(p.received)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Payment Collection</h2>
              <p className="dash-panel-sub">Total bill mein se kitna wasool hua</p>
            </div>
          </div>
          <div className="dash-collect">
            <div className="dash-collect-percent">{stats.percent}%</div>
            <div className="dash-progress">
              <div className="dash-progress-fill" style={{ width: `${stats.percent}%` }} />
            </div>
            <div className="dash-collect-row">
              <div>
                <span className="dash-collect-label">Received</span>
                <span className="dash-collect-value dash-green">{formatPKR(stats.received)}</span>
              </div>
              <div>
                <span className="dash-collect-label">Remaining</span>
                <span className="dash-collect-value dash-red">{formatPKR(stats.remaining)}</span>
              </div>
              <div>
                <span className="dash-collect-label">Total</span>
                <span className="dash-collect-value">{formatPKR(stats.totalRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lists row */}
      <div className="dash-grid-2 dash-grid-equal">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Top Pending Dues</h2>
              <p className="dash-panel-sub">Sab se zyada baqi amount wale clients</p>
            </div>
          </div>
          <div className="dash-list">
            {topDues.length === 0 ? (
              <div className="dash-empty-small">Kisi ki payment baqi nahi</div>
            ) : (
              topDues.map(({ s, due }) => (
                <div key={s.id} className="dash-list-item">
                  <div className="dash-avatar">{s.client_name.charAt(0)}</div>
                  <div className="dash-list-info">
                    <div className="dash-list-name">{s.client_name}</div>
                    <div className="dash-list-sub">{s.plan} • {s.phone}</div>
                  </div>
                  <div className="dash-list-amount dash-red">{formatPKR(due)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Expiring Soon</h2>
              <p className="dash-panel-sub">Agle 30 din mein khatam hone wali subscriptions</p>
            </div>
          </div>
          <div className="dash-list">
            {expiringSoon.length === 0 ? (
              <div className="dash-empty-small">Abhi koi subscription khatam hone wali nahi</div>
            ) : (
              expiringSoon.map(({ s, left }) => (
                <div key={s.id} className="dash-list-item">
                  <div className="dash-avatar dash-avatar-orange">{s.client_name.charAt(0)}</div>
                  <div className="dash-list-info">
                    <div className="dash-list-name">{s.client_name}</div>
                    <div className="dash-list-sub">Expiry: {formatDate(s.end_date)}</div>
                  </div>
                  <span className={`dash-badge ${left <= 7 ? "dash-badge-unpaid" : "dash-badge-partial"}`}>
                    {left === 0 ? "Aaj" : `${left} din`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent table */}
      <div className="dash-panel">
        <div className="dash-panel-head">
          <div>
            <h2 className="dash-panel-title">Recent Subscriptions</h2>
            <p className="dash-panel-sub">Naye lene wale clients</p>
          </div>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Plan</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Payment</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s, i) => {
                const remaining = Math.max(s.total_amount - s.paid_amount, 0);
                const pay = getPayState(s);
                const st = getSubStatus(s.end_date);
                return (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="dash-client">{s.client_name}</div>
                      <div className="dash-phone">{s.phone}</div>
                    </td>
                    <td>{s.plan}</td>
                    <td>{formatPKR(s.total_amount)}</td>
                    <td className="dash-green dash-bold">{formatPKR(s.paid_amount)}</td>
                    <td className={remaining > 0 ? "dash-red dash-bold" : ""}>{formatPKR(remaining)}</td>
                    <td>
                      <span className={`dash-badge dash-badge-${pay}`}>
                        {pay === "paid" ? "Paid" : pay === "partial" ? "Partial" : "Unpaid"}
                      </span>
                    </td>
                    <td>{formatDate(s.end_date)}</td>
                    <td>
                      <span className={`dash-badge dash-badge-${st}`}>
                        {st === "active" ? "Active" : st === "expiring" ? "Expiring soon" : "Expired"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}