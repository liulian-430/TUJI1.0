import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useUIStore } from '@/store/useUIStore';
import { useUserStore } from '@/store/useUserStore';

// 布局组件
import { DesktopNavBar } from '@/components/layout/DesktopNavBar';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { Sidebar } from '@/components/layout/Sidebar';

// 通用组件
import { ToastContainer } from '@/components/common/Toast';
import { Loading } from '@/components/common/Loading';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// 页面组件
import { Home } from '@/pages/Home';
import { AI } from '@/pages/AI';
import { Map } from '@/pages/Map';
import { Search } from '@/pages/Search';
import { My } from '@/pages/My';
import { POIDetail } from '@/pages/POIDetail';
import { TripDetail } from '@/pages/TripDetail';
import { Budget } from '@/pages/Budget';

// 检测是否为移动端
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// 主布局组件
function MainLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={twMerge(clsx('min-h-screen', theme === 'dark' && 'dark'))}>
      {/* 桌面端导航栏 */}
      {!isMobile && <DesktopNavBar />}

      {/* 主体内容 */}
      <div className={twMerge(clsx(!isMobile && 'flex gap-6 container'))}>
        {/* 桌面端侧边栏 */}
        {!isMobile && <Sidebar />}

        {/* 页面内容 */}
        <main className={twMerge(clsx('flex-1', isMobile && 'pb-20'))}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      {/* 移动端导航栏 */}
      {isMobile && <MobileNavBar />}

      {/* 全局组件 */}
      <ToastContainer />
      <Loading fullScreen />
    </div>
  );
}

// 路由守卫
function ProtectedRoute({
  children,
  requireAuth = false,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// 应用入口
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* 公开页面 */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/ai"
          element={
            <MainLayout>
              <AI />
            </MainLayout>
          }
        />
        <Route
          path="/map"
          element={
            <MainLayout>
              <Map />
            </MainLayout>
          }
        />
        <Route
          path="/search"
          element={
            <MainLayout>
              <Search />
            </MainLayout>
          }
        />
        <Route
          path="/my"
          element={
            <MainLayout>
              <My />
            </MainLayout>
          }
        />
        <Route
          path="/poi/:id"
          element={
            <MainLayout>
              <POIDetail />
            </MainLayout>
          }
        />
        <Route
          path="/trip/:id"
          element={
            <MainLayout>
              <TripDetail />
            </MainLayout>
          }
        />
        <Route
          path="/trip/:id/budget"
          element={
            <MainLayout>
              <Budget />
            </MainLayout>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}