import { useMemo, useState } from "react";
import {
  LuUsers,
  LuWallet,
  LuDownload,
  LuHourglass,
  LuSearch,
  LuPlus,
  LuCircleCheck,
} from "react-icons/lu";
import "./payments.css";

type Sub = {
  id: number;
  client_name: string;
  phone: string;
  plan: string;
  total_amount: number;
  paid_amount: number;
  end_date: string;
};

type PayFilter = "all" | "paid" | "partial" | "unpaid";

const INITIAL: Sub[] = [
  { id: 1, client_name: "Ali Traders", phone: "0300-1111111", plan: "Yearly", total_amount: 60000, paid_amount: 60000, end_date: "2027-01-10" },
  { id: 2, client_name: "Hassan Electronics", phone: "0301-2222222", plan: "6 Months", total_amount: 35000, paid_amount: 20000, end_date: "2026-12-01" },
  { id: 3, client_name: "Noor Mart", phone: "0302-3333333", plan: "Monthly", total_amount: 5000, paid_amount: 0, end_date: "2026-11-05" },
  { id: 4, client_name: "City Pharmacy", phone: "0303-4444444", plan: "Yearly", total_amount: 60000, paid_amount: 45000, end_date: "2027-03-15" },
  { id: 5, client_name: "Bilal Store", phone: "0304-5555555", plan: "Monthly", total_amount: 5000, paid_amount: 5000, end_date: "2026-11-20" },
  { id: 6, client_name: "Usman Garments", phone: "0305-6666666", plan: "6 Months", total_amount: 35000, paid_amount: 35000, end_date: "2027-02-01" },
  { id: 7, client_name: "Fresh Bakers", phone: "0306-7777777", plan: "Monthly", total_amount: 5000, paid_amount: 2500, end_date: "2026-11-28" },
  { id: 8, client_name: "Zain Autos", phone: "0307-8888888", plan: "Yearly", total_amount: 60000, paid_amount: 30000, end_date: "2027-02-01" },
];

const formatPKR = (n: number) => "Rs " + Math.round(n || 0).toLocaleString("en-PK");

const formatDate = (d: string) => {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getPayState = (s: Sub): Exclude<PayFilter, "all"> => {
  if (s.paid_amount >= s.total_amount) return "paid";
  if (s.paid_amount > 0) return "partial";
  return "unpaid";
};

export default function Payments() {
  const [subs, setSubs] = useState<Sub[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [payFilter, setPayFilter] = useState<PayFilter>("all");

  const stats = useMemo(() => {
    const total = subs.reduce((a, s) => a + s.total_amount, 0);
    const received = subs.reduce((a, s) => a + s.paid_amount, 0);
    const remaining = Math.max(total - received, 0);
    const percent = total > 0 ? Math.round((received / total) * 100) : 0;
    const pending = subs.filter((s) => s.paid_amount < s.total_amount).length;
    const cleared = subs.length - pending;
    return { count: subs.length, total, received, remaining, percent, pending, cleared };
  }, [subs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subs.filter((s) => {
      const matchSearch =
        !q ||
        s.client_name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.plan.toLowerCase().includes(q);
      const matchPay = payFilter === "all" || getPayState(s) === payFilter;
      return matchSearch && matchPay;
    });
  }, [subs, search, payFilter]);

  const addPayment = (s: Sub) => {
    const remaining = s.total_amount - s.paid_amount;
    if (remaining <= 0) return;
    const val = window.prompt(
      `${s.client_name} se kitni payment mili? (Remaining: ${remaining})`,
      String(remaining)
    );
    if (val === null) return;
    const amount = Number(val);
    if (!amount || amount <= 0) return;
    setSubs((prev) =>
      prev.map((x) =>
        x.id === s.id ? { ...x, paid_amount: Math.min(x.paid_amount + amount, x.total_amount) } : x
      )
    );
  };

  return (
    <div className="pay-page">
      {/* Header */}
      <div className="pay-header">
        <h1 className="pay-title">Payments</h1>
        <p className="pay-subtitle">Jin users ne subscription liya hua hai un ki payment ki detail</p>
      </div>

      {/* KPI cards */}
      <div className="pay-cards">
        <div className="pay-card">
          <div className="pay-icon pay-icon-amber">
            <LuUsers size={24} />
          </div>
          <div className="pay-card-body">
            <span className="pay-card-label">Subscribed Users</span>
            <span className="pay-card-value">{stats.count}</span>
            <span className="pay-card-note">{stats.cleared} ka hisaab clear hai</span>
          </div>
        </div>

        <div className="pay-card">
          <div className="pay-icon pay-icon-purple">
            <LuWallet size={24} />
          </div>
          <div className="pay-card-body">
            <span className="pay-card-label">Total Amount</span>
            <span className="pay-card-value">{formatPKR(stats.total)}</span>
            <span className="pay-card-note">Kul bill amount</span>
          </div>
        </div>

        <div className="pay-card">
          <div className="pay-icon pay-icon-green">
            <LuDownload size={24} />
          </div>
          <div className="pay-card-body">
            <span className="pay-card-label">Received</span>
            <span className="pay-card-value pay-green">{formatPKR(stats.received)}</span>
            <div className="pay-mini-bar">
              <div className="pay-mini-fill" style={{ width: `${stats.percent}%` }} />
            </div>
          </div>
        </div>

        <div className="pay-card">
          <div className="pay-icon pay-icon-red">
            <LuHourglass size={24} />
          </div>
          <div className="pay-card-body">
            <span className="pay-card-label">Remaining</span>
            <span className="pay-card-value pay-red">{formatPKR(stats.remaining)}</span>
            <span className="pay-card-note">{stats.pending} clients ki baqi hai</span>
          </div>
        </div>
      </div>

      {/* Table panel */}
      <div className="pay-panel">
        <div className="pay-panel-head">
          <div>
            <h2 className="pay-panel-title">Users ({filtered.length})</h2>
            <p className="pay-panel-sub">Search karein ya payment status se filter karein</p>
          </div>
          <div className="pay-tools">
            <div className="pay-search-wrap">
              <LuSearch size={16} />
              <input
                className="pay-search"
                type="text"
                placeholder="Search name, phone, plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="pay-select"
              value={payFilter}
              onChange={(e) => setPayFilter(e.target.value as PayFilter)}
            >
              <option value="all">All payments</option>
              <option value="paid">Fully paid</option>
              <option value="partial">Partially paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        <div className="pay-table-wrap">
          <table className="pay-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Plan</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Payment</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="pay-empty">
                    Koi record nahi mila
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => {
                  const remaining = Math.max(s.total_amount - s.paid_amount, 0);
                  const state = getPayState(s);
                  return (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="pay-user">{s.client_name}</div>
                        <div className="pay-phone">{s.phone}</div>
                      </td>
                      <td>{s.plan}</td>
                      <td>{formatPKR(s.total_amount)}</td>
                      <td className="pay-green pay-bold">{formatPKR(s.paid_amount)}</td>
                      <td className={remaining > 0 ? "pay-red pay-bold" : ""}>{formatPKR(remaining)}</td>
                      <td>
                        <span className={`pay-badge pay-badge-${state}`}>
                          {state === "paid" ? "Paid" : state === "partial" ? "Partial" : "Unpaid"}
                        </span>
                      </td>
                      <td>{formatDate(s.end_date)}</td>
                      <td>
                        {remaining > 0 ? (
                          <button className="pay-btn" onClick={() => addPayment(s)}>
                            <LuPlus size={14} />
                            Payment
                          </button>
                        ) : (
                          <span className="pay-done">
                            <LuCircleCheck size={15} />
                            Clear
                          </span>
                        )}
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