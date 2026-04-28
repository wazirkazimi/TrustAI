import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ScanLine, BookOpen, User } from 'lucide-react';

const navItems = [
  { name: 'Home',   path: '/home',    icon: Home },
  { name: 'Search', path: '/search',  icon: Search },
  { name: 'Scan',   path: '/scan',    icon: ScanLine, special: true },
  { name: 'Log',    path: '/log',     icon: BookOpen },
  { name: 'Profile',path: '/profile', icon: User },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl shadow-gray-200/50">
      <div className="max-w-3xl mx-auto flex items-end justify-around px-2 py-2 sm:py-3">
        {navItems.map(({ name, path, icon: Icon, special }) =>
          special ? (
            <Link key={path} to={path}
              className="flex flex-col items-center -mt-5 relative">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl shadow-purple-600/40 transition-all ${pathname === path ? 'bg-purple-700 scale-110' : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'}`}>
                <Icon size={26} className="text-white"/>
              </div>
              <span className={`text-[10px] font-bold mt-1.5 ${pathname === path ? 'text-purple-600' : 'text-gray-400'}`}>{name}</span>
            </Link>
          ) : (
            <Link key={path} to={path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all ${pathname === path ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icon size={22} strokeWidth={pathname === path ? 2.5 : 2}/>
              <span className="text-[10px] font-bold">{name}</span>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
