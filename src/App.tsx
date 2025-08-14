import { Link, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OwnersPage from "./pages/OwnersPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow p-4 flex gap-4">
        <Link to="/properties" className="text-blue-500 hover:underline">
          Properties
        </Link>
        <Link to="/owners" className="text-blue-500 hover:underline">
          Owners
        </Link>
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
