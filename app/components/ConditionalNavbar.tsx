// app/components/ConditionalNavbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import MainNavbar from './MainNavbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (isAdminPage) {
    return null;
  }
  
  return <MainNavbar />;
}