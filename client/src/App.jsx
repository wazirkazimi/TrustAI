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
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import RatingSystem from './pages/RatingSystem';

import BottomNav from './components/layout/BottomNav';
import Register from './pages/Register';
import Login from './pages/Login';
import Categories from './pages/Categories';

const AUTH_PAGES = ['/', '/login', '/register', '/about', '/how-it-works', '/rating-system'];

function AppContent() {
  const location = useLocation();
  const showBottomNav = !AUTH_PAGES.includes(location.pathname);
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col overflow-x-hidden relative" style={{ minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/rating-system" element={<RatingSystem />} />
          <Route path="/home" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/results/:scanId" element={<Results />} />
          <Route path="/search" element={<Search />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/log" element={<FoodLog />} />
          <Route path="/profile" element={<Profile />} />
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
