'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show the main header on room pages
  if (pathname?.startsWith('/rooms/')) {
    return null;
  }
  
  return <Header />;
}
