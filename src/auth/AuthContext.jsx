import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthApi, tokenStore } from "../api/client";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());
  const [claims, setClaims] = useState(() => (token ? parseJwt(token) : null));
  const [profile, setProfile] = useState(null);

  const isExpired = (cl) => {
    if (!cl?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return cl.exp <= now;
  };

  useEffect(() => {
    if (!token || isExpired(claims)) {
      setProfile(null);
      return;
    }
    AuthApi.profile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [token]);

  const roles = useMemo(() => {
    if (!claims) return [];
    const r =
      claims["role"] ??
      claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return Array.isArray(r) ? r : r ? [r] : [];
  }, [claims]);

  const hasRole = (r) => roles.includes(r);

  const login = async (username, password) => {
    const data = await AuthApi.login(username, password);
    const t = data.Token ?? data.token;
    if (!t) throw new Error("No token in response");
    tokenStore.set(t);
    setToken(t);
    setClaims(parseJwt(t));
  };

  const logout = () => {
    tokenStore.clear();
    setToken(null);
    setClaims(null);
    setProfile(null);
  };

  const value = {
    token,
    claims,
    roles,
    profile,
    isAuth: !!token && !isExpired(claims),
    hasRole,
    login,
    logout,
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
