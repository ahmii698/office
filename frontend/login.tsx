import { useState } from "react";
import {
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuKeyRound,
  LuShieldCheck,
  LuCircleAlert,
  LuCircleCheck,
  LuArrowLeft,
  LuLogIn,
} from "react-icons/lu";
import { checkLogin, emailExists, resetPassword } from "./auth";
import "./login.css";

type Props = {
  onLogin: () => void;
};

type View = "login" | "forgot" | "reset";

export default function Login({ onLogin }: Props) {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const goTo = (v: View) => {
    setView(v);
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!email.trim() || !password) {
      setError("Email aur password dono likho");
      return;
    }
    if (!checkLogin(email, password)) {
      setError("Email ya password galat hai");
      return;
    }
    setError("");
    onLogin();
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError("Apni email likho");
      return;
    }
    if (!emailExists(resetEmail)) {
      setError("Wrong email, ye email register nahi hai");
      return;
    }
    setError("");
    setView("reset");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setError("Password kam az kam 6 characters ka hona chahiye");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Dono passwords match nahi kar rahe");
      return;
    }
    resetPassword(newPass);
    setNewPass("");
    setConfirmPass("");
    setPassword("");
    setEmail(resetEmail.trim());
    setError("");
    setSuccess("Password reset ho gaya. Ab naye password se login karo.");
    setView("login");
  };

  return (
    <div className="lg-page">
      <div className="lg-card">
        {/* Brand */}
        <div className="lg-brand">
          <span className="lg-logo">F</span>
          <div>
            <div className="lg-brand-name">Fusix Admin</div>
            <div className="lg-brand-sub">Subscription Manager</div>
          </div>
        </div>

        {/* LOGIN */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="lg-form">
            <div className="lg-icon lg-icon-amber">
              <LuShieldCheck size={24} />
            </div>
            <h1 className="lg-title">Welcome Back</h1>
            <p className="lg-sub">Dashboard kholne ke liye login karo</p>

            {success && (
              <div className="lg-success">
                <LuCircleCheck size={16} />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="lg-error">
                <LuCircleAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <label className="lg-label">Email</label>
            <div className="lg-field">
              <LuMail size={16} />
              <input
                className="lg-input"
                type="email"
                placeholder="admin@fusixtech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <label className="lg-label">Password</label>
            <div className="lg-field">
              <LuLock size={16} />
              <input
                className="lg-input"
                type={showPass ? "text" : "password"}
                placeholder="Password likho"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="lg-eye"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <LuEyeOff size={17} /> : <LuEye size={17} />}
              </button>
            </div>

            <div className="lg-row">
              <button
                type="button"
                className="lg-link"
                onClick={() => {
                  setSuccess("");
                  setResetEmail(email);
                  goTo("forgot");
                }}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="lg-btn">
              <LuLogIn size={17} />
              Login
            </button>
          </form>
        )}

        {/* FORGOT */}
        {view === "forgot" && (
          <form onSubmit={handleForgot} className="lg-form">
            <div className="lg-icon lg-icon-purple">
              <LuKeyRound size={24} />
            </div>
            <h1 className="lg-title">Forgot Password</h1>
            <p className="lg-sub">Apni email likho, sahi hui to password reset ka option khulega</p>

            {error && (
              <div className="lg-error">
                <LuCircleAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <label className="lg-label">Email</label>
            <div className="lg-field">
              <LuMail size={16} />
              <input
                className="lg-input"
                type="email"
                placeholder="admin@fusixtech.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="lg-btn">
              Continue
            </button>
            <button type="button" className="lg-btn-ghost" onClick={() => goTo("login")}>
              <LuArrowLeft size={16} />
              Back to Login
            </button>
          </form>
        )}

        {/* RESET */}
        {view === "reset" && (
          <form onSubmit={handleReset} className="lg-form">
            <div className="lg-icon lg-icon-green">
              <LuLock size={24} />
            </div>
            <h1 className="lg-title">Naya Password</h1>
            <p className="lg-sub">
              <strong className="lg-email">{resetEmail}</strong> ke liye naya password set karo
            </p>

            {error && (
              <div className="lg-error">
                <LuCircleAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <label className="lg-label">New Password</label>
            <div className="lg-field">
              <LuLock size={16} />
              <input
                className="lg-input"
                type="password"
                placeholder="Kam az kam 6 characters"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>

            <label className="lg-label">Confirm Password</label>
            <div className="lg-field">
              <LuLock size={16} />
              <input
                className="lg-input"
                type="password"
                placeholder="Dobara likho"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>

            <button type="submit" className="lg-btn">
              Reset Password
            </button>
            <button type="button" className="lg-btn-ghost" onClick={() => goTo("login")}>
              Cancel
            </button>
          </form>
        )}

        <div className="lg-footer">© Fusix Tech</div>
      </div>
    </div>
  );
}