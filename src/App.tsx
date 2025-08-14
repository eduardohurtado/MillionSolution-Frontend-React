import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OwnersPage from "./pages/OwnersPage";

function App() {
  const location = useLocation();

  const navItems = [
    { path: "/properties", label: "🏠 Properties" },
    { path: "/owners", label: "👤 Owners" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand */}
            <div className="text-2xl font-bold text-blue-600 tracking-wide">
              Million App
            </div>

            {/* Nav Links */}
            <div className="flex space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/properties" element={<LandingPage />} />
        <Route path="/owners" element={<OwnersPage />} />
        <Route path="*" element={<Navigate to="/properties" replace />} />
      </Routes>
    </div>
  );
}

export default App;
