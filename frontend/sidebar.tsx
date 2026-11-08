import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuCreditCard,
  LuFlaskConical,
  LuHourglass,
  LuLogOut,
  LuMenu,
  LuX,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import "./sidebar.css";

type Props = {
  expiringCount: number;
  onLogout: () => void;
};

type LinkItem = {
  to: string;
  label: string;
  icon: IconType;
};

const LINKS: LinkItem[] = [
  { to: "/", label: "Dashboard", icon: LuLayoutDashboard },
  { to: "/payments", label: "Payments", icon: LuCreditCard },
  { to: "/trial", label: "Trial Users", icon: LuFlaskConical },
  { to: "/expiring", label: "Trial Expiring", icon: LuHourglass },
];

export default function Sidebar({ expiringCount, onLogout }: Props) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Kya aap logout karna chahte hain?")) {
      setOpen(false);
      onLogout();
    }
  };

  return (
    <>
      <div className="sb-topbar">
        <button
          className="sb-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <LuMenu size={22} />
        </button>
        <span className="sb-topbar-title">Admin Panel</span>
      </div>

      {open && <div className="sb-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sb-sidebar ${open ? "sb-open" : ""}`}>
        <div className="sb-brand">
          <span className="sb-brand-logo">F</span>
          <div className="sb-brand-text">
            <div className="sb-brand-name">Fusix Admin</div>
            <div className="sb-brand-sub">Subscription Manager</div>
          </div>
          <button
            className="sb-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <LuX size={20} />
          </button>
        </div>

        <nav className="sb-nav">
          {LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `sb-link ${isActive ? "sb-link-active" : ""}`
                }
              >
                <Icon className="sb-icon" size={20} />
                <span className="sb-label">{l.label}</span>
                {l.to === "/expiring" && expiringCount > 0 && (
                  <span className="sb-count">{expiringCount}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <button className="sb-logout" onClick={handleLogout}>
          <LuLogOut className="sb-logout-icon" size={20} />
          <span className="sb-label">Logout</span>
        </button>

        <div className="sb-footer">© Fusix Tech</div>
      </aside>
    </>
  );
}