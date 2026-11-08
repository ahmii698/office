import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../sidebar";
import Dashboard from "../dashboard";
import Payments from "../payments";
import Trial from "../trial";
import Expiring from "../expiring";
import Login from "../login";
import { isLoggedIn, setLoggedIn } from "../auth";
import { type TrialUser, getDaysLeft, loadTrials, saveTrials } from "../trialData";
import "./App.css";

function App() {
  const [authed, setAuthed] = useState<boolean>(isLoggedIn());
  const [trials, setTrials] = useState<TrialUser[]>(loadTrials);

  useEffect(() => {
    saveTrials(trials);
  }, [trials]);

  const handleLogin = () => {
    setLoggedIn(true);
    setAuthed(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setAuthed(false);
  };

  const addTrial = (u: Omit<TrialUser, "id">) => {
    setTrials((prev) => [...prev, { ...u, id: Date.now() }]);
  };

  const extendTrial = (id: number, extra: number) => {
    setTrials((prev) => prev.map((t) => (t.id === id ? { ...t, days: t.days + extra } : t)));
  };

  const removeTrial = (id: number) => {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  };

  const expiringCount = trials.filter((t) => {
    const left = getDaysLeft(t);
    return left >= 0 && left <= 1;
  }).length;

  if (!authed) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar expiringCount={expiringCount} onLogout={handleLogout} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payments" element={<Payments />} />
            <Route
              path="/trial"
              element={
                <Trial
                  trials={trials}
                  onAdd={addTrial}
                  onExtend={extendTrial}
                  onRemove={removeTrial}
                />
              }
            />
            <Route path="/expiring" element={<Expiring trials={trials} onExtend={extendTrial} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;