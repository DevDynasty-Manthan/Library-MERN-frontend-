import { createContext, useEffect, useMemo, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // can be null in onboarding
  const [token, setToken] = useState(null);
  const [session, setSession] = useState(null); // onboarding session info (optional)

  // Restore from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedSession = localStorage.getItem("session");

    if (storedToken) setToken(storedToken);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch {
        localStorage.removeItem("session");
        setSession(null);
      }
    }
  }, []);

  // Normal app login (expects old backend shape)
  const login = (response) => {
    const userData = response?.data; // { id, name, email, role, token }
    if (!userData?.token) throw new Error("login(): token missing in response.data");

    const safeUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    setUser(safeUser);
    setToken(userData.token);
    setSession(null);

    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(safeUser));
    localStorage.removeItem("session");
  };

  // Onboarding start (expects step1 onboarding shape)
  const startOnboardingSession = ({ token, sessionId, currentStep, email }) => {
    if (!token) throw new Error("startOnboardingSession(): token missing");

    setToken(token);
    setUser(email ? { email, role: "onboarding" } : null);

    const sessionObj = { sessionId, currentStep, email };
    setSession(sessionObj);

    localStorage.setItem("token", token);
    if (email) localStorage.setItem("user", JSON.stringify({ email, role: "onboarding" }));
    localStorage.setItem("session", JSON.stringify(sessionObj));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSession(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("session");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      session,
      login,
      startOnboardingSession,
      logout,
      isAuthenticated: !!token, // token-based auth (works for onboarding too)
    }),
    [user, token, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
