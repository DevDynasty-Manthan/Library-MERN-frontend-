import { createContext, useEffect, useMemo, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [session, setSession] = useState(null);

  // ✅ Restore from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("🔄 AuthContext: Restoring from localStorage");
    console.log("   storedToken:", storedToken ? "EXISTS" : "MISSING");
    console.log("   storedUser:", storedUser);

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser && storedUser !== "{}") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && Object.keys(parsedUser).length > 0) {
          setUser(parsedUser);
          console.log("✅ User restored:", parsedUser);
        } else {
          console.warn("⚠️ Empty user object in localStorage");
        }
      } catch (err) {
        console.error("❌ Failed to parse stored user:", err);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  // ✅ Updated login function
  const login = (response) => {
    let userData;
    let authToken;

    console.log("🔑 AuthContext.login() called");
    console.log("   Full response:", response);

    // ✅ Format 1: Direct { token, user }
    if (response?.token && response?.user) {
      console.log("✅ Format 1 detected: { token, user }");
      authToken = response.token;
      userData = response.user;
    }
    // ✅ Format 2: Nested { data: { token, user } }
    else if (response?.data?.token && response?.data?.user) {
      console.log("✅ Format 2 detected: { data: { token, user } }");
      authToken = response.data.token;
      userData = response.data.user;
    }
    // ✅ Format 3: Legacy { data: { token, id, name, email, role } }
    else if (response?.data?.token) {
      console.log("✅ Format 3 detected: Legacy format");
      authToken = response.data.token;
      userData = response.data;
    }
    else {
      console.error("❌ NO VALID FORMAT DETECTED");
      console.error("   response structure:", {
        hasToken: !!response?.token,
        hasUser: !!response?.user,
        hasData: !!response?.data,
        hasDataToken: !!response?.data?.token,
        hasDataUser: !!response?.data?.user,
      });
      throw new Error("login(): Invalid response format - token or user missing");
    }

    if (!authToken) {
      console.error("❌ authToken is undefined");
      throw new Error("login(): token missing");
    }

    if (!userData) {
      console.error("❌ userData is undefined");
      throw new Error("login(): user data missing");
    }

    console.log("📦 Extracted userData:", userData);

    // ✅ Normalize user object - handle both formats
    const safeUser = {
      id: userData.id || userData._id || userData.userId,
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "student",
    };

    console.log("✅ Normalized safeUser:", safeUser);

    // ✅ Validate safeUser has required fields
    if (!safeUser.id || !safeUser.email) {
      console.error("❌ Missing required user fields:", safeUser);
      throw new Error("login(): user missing required fields (id or email)");
    }

    console.log("✅ Setting user state:", safeUser);
    console.log("✅ Setting token");

    setUser(safeUser);
    setToken(authToken);
    setSession(null);

    const userJson = JSON.stringify(safeUser);
    console.log("💾 Saving to localStorage:");
    console.log("   token:", authToken.substring(0, 30) + "...");
    console.log("   user JSON:", userJson);

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", userJson);
    localStorage.removeItem("session");

    // ✅ Verify what was actually saved
    const savedUser = localStorage.getItem("user");
    console.log("✅ Verification - user in localStorage:", savedUser);
    
    if (savedUser === "{}") {
      console.error("❌ WARNING: Empty object saved to localStorage!");
    }
  };

  // Onboarding start
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
      onboardingSession: session,
      login,
      startOnboardingSession,
      logout,
      isAuthenticated: !!token,
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

export default AuthContext;
