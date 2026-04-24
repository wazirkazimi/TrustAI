import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Scan, LayoutGrid, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Category', path: '/categories', icon: LayoutGrid },
    { name: 'Scan', path: '/scan', icon: Scan, isCenter: true },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 w-full md:max-w-[430px] bg-white border-t border-gray-100 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(124,58,237,0.1)] z-50">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/scan' && location.pathname.startsWith('/results'));
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link to={item.path} key={item.name} className="relative -top-6">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${isActive ? 'primary-gradient shadow-primary/30' : 'bg-gray-800 text-white'}`}>
                  <Icon size={28} className={isActive ? 'text-white' : 'text-gray-100'} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              to={item.path}
              key={item.name}
              className={`flex flex-col items-center justify-center w-14 transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:text-primary/70'}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
