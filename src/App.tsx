import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import StatusPage from "./components/status/StatusPage";
import DirectoryPage from "./components/directory/DirectoryPage";
import MapPage from "./components/map/MapPage";
import ProfilePage from "./components/profile/ProfilePage";
import ManageUsers from "./components/admin/ManageUsers";
import EmergencyHistory from "./components/admin/EmergencyHistory";
import LandingPage from "./components/landing/LandingPage";
import routes from "tempo-routes";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    // In a real app, this would check for a stored token or session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <p className="flex items-center justify-center h-screen">Loading...</p>
      }
    >
      <>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              !user ? (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? <DashboardPage user={user} /> : <Navigate to="/landing" />
            }
          />
          <Route
            path="/manage-users"
            element={
              user ? <ManageUsers user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/emergency-history"
            element={
              user ? <EmergencyHistory user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/status"
            element={
              user ? <StatusPage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/directory"
            element={
              user ? <DirectoryPage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/map"
            element={user ? <MapPage user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={
              user ? <ProfilePage user={user} /> : <Navigate to="/login" />
            }
          />

          {/* Legacy route */}
          <Route path="/home" element={<Navigate to="/" />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
