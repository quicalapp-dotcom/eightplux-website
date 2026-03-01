'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import CartNotification from './CartNotification';

interface AppLayoutWrapperProps {
  children: ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isAdminRoute = pathname?.startsWith('/admin');
  const hideLayout = isAdminRoute || isAuthRoute;

    return (
    <>
      {!hideLayout && <Navbar />}
      <CartNotification />
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}