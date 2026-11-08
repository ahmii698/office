const ADMIN_EMAIL = "ahmedmalik30600@gmail.com";
const DEFAULT_PASSWORD = "password";
const PASS_KEY = "fusix_admin_password";
const AUTH_KEY = "fusix_logged_in";

export const getPassword = (): string => {
  try {
    return localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
};

export const emailExists = (email: string) =>
  email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

export const checkLogin = (email: string, password: string) =>
  emailExists(email) && password === getPassword();

export const resetPassword = (newPassword: string) => {
  try {
    localStorage.setItem(PASS_KEY, newPassword);
  } catch {
    /* ignore */
  }
};

export const isLoggedIn = (): boolean => {
  try {
    return localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
};

export const setLoggedIn = (value: boolean) => {
  try {
    if (value) localStorage.setItem(AUTH_KEY, "1");
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
};