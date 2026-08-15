'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar, { type AdminView } from './AdminSidebar';

const viewTitles: Record<AdminView, string> = {
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  services: 'Services',
  blog: 'Blog',
  gallery: 'Gallery',
  testimonials: 'Testimonials',
  'working-hours': 'Working Hours',
  'blocked-dates': 'Blocked Dates',
  settings: 'Settings',
};

type AdminLayoutProps = {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
  onLogout: () => void;
  children: React.ReactNode;
};

export default function AdminLayout({
  currentView,
  onNavigate,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-warm-50">
      <AdminSidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onLogout={onLogout}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{viewTitles[currentView]}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
