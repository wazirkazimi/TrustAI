import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Results from './pages/Results';
import Search from './pages/Search';
import FoodLog from './pages/FoodLog';
import Profile from './pages/Profile';

import BottomNav from './components/layout/BottomNav';
import Register from './pages/Register';
import Categories from './pages/Categories';

const AUTH_PAGES = ['/', '/login', '/register'];

function AppContent() {
  const location = useLocation();
  const showBottomNav = !AUTH_PAGES.includes(location.pathname);
  const isLanding = location.pathname === '/';

  return (
    <div className={`min-h-screen bg-[#F5F3FF] flex flex-col ${!isLanding ? 'md:max-w-[430px] md:mx-auto md:shadow-2xl' : ''} overflow-x-hidden relative`} style={{ minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"              element={<Landing />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/home"          element={<Home />} />
          <Route path="/scan"          element={<Scan />} />
          <Route path="/results/:scanId" element={<Results />} />
          <Route path="/search"        element={<Search />} />
          <Route path="/categories"    element={<Categories />} />
          <Route path="/log"           element={<FoodLog />} />
          <Route path="/profile"       element={<Profile />} />
        </Routes>
      </AnimatePresence>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
