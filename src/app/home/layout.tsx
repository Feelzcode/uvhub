// app/home/layout.tsx
import Footer from '@/components/ui/HomeComponents/Footer';
import Navbar from '@/components/ui/HomeComponents/Navbar';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}
export default function HomeLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}