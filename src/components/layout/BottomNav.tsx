import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/ai-planner', label: 'AI' },
  { path: '/new-trip', label: '＋' },
  { path: '/map', label: '地图' },
  { path: '/profile', label: '我的' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="glass-nav md:hidden">
      {navItems.map(({ path, label }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`nav-item min-w-[3rem] ${isActive(path) ? 'active' : ''}`}
        >
          <span className={`text-lg ${path === '/new-trip' ? 'font-bold text-xl' : ''}`}>
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
