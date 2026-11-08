import { useMemo } from "react";
import { LuCircleCheck, LuClock, LuCalendarX, LuPlus, LuMessageCircle } from "react-icons/lu";
import { type TrialUser, getDaysLeft, getEndDate, formatDate, waLink } from "./trialData";
import "./expiring.css";

type Props = {
  trials: TrialUser[];
  onExtend: (id: number, extra: number) => void;
};

export default function Expiring({ trials, onExtend }: Props) {
  const list = useMemo(
    () =>
      trials
        .map((t) => ({ t, left: getDaysLeft(t) }))
        .filter((x) => x.left >= 0 && x.left <= 1)
        .sort((a, b) => a.left - b.left),
    [trials]
  );

  const extend = (t: TrialUser) => {
    const val = window.prompt(`${t.name} ka trial kitne din barhana hai?`, "3");
    if (val === null) return;
    const n = Number(val);
    if (!n || n < 1) return;
    onExtend(t.id, n);
  };

  return (
    <div className="exp-page">
      <div className="exp-header">
        <h1 className="exp-title">Trial Expiring</h1>
        <p className="exp-subtitle">Jin ka trial 1 din mein khatam ho raha hai (ya aaj last din hai)</p>
      </div>

      {list.length === 0 ? (
        <div className="exp-empty">
          <div className="exp-empty-icon">
            <LuCircleCheck size={34} />
          </div>
          <div className="exp-empty-text">Abhi kisi ka trial khatam hone wala nahi hai</div>
        </div>
      ) : (
        <div className="exp-grid">
          {list.map(({ t, left }) => (
            <div key={t.id} className={`exp-card ${left === 0 ? "exp-card-today" : ""}`}>
              <div className="exp-card-top">
                <div>
                  <div className="exp-name">{t.name}</div>
                  <div className="exp-phone">{t.phone || "-"}</div>
                </div>
                <span className={`exp-badge ${left === 0 ? "exp-badge-today" : "exp-badge-one"}`}>
                  <LuClock size={13} />
                  {left === 0 ? "Aaj last din" : "1 din bacha"}
                </span>
              </div>

              <div className="exp-info">
                <div>
                  <span className="exp-info-label">Trial</span>
                  <span className="exp-info-value">{t.days} din</span>
                </div>
                <div>
                  <span className="exp-info-label">
                    <LuCalendarX size={12} /> End Date
                  </span>
                  <span className="exp-info-value">{formatDate(getEndDate(t))}</span>
                </div>
              </div>

              <div className="exp-actions">
                <button className="exp-btn" onClick={() => extend(t)}>
                  <LuPlus size={16} />
                  Extend Trial
                </button>
                {t.phone && (
                  <a
                    className="exp-btn exp-btn-wa"
                    href={waLink(
                      t.phone,
                      `Assalam o Alaikum ${t.name}, aap ka software trial jald khatam ho raha hai. Subscription ke liye rabta karein.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LuMessageCircle size={16} />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}