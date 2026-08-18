'use client';

import Navbar from '@/frontend/components/Navbar';
import Footer from '@/frontend/components/Footer';
import { ClinicProvider } from '@/frontend/context/ClinicContext';

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ClinicProvider>
  );
}
