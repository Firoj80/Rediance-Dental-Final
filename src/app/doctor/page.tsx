'use client';

import { useState } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import type { AdminView } from '@/components/admin/AdminSidebar';
import Dashboard from '@/components/admin/Dashboard';
import AppointmentsManager from '@/components/admin/AppointmentsManager';
import ServicesManager from '@/components/admin/ServicesManager';
import BlogManager from '@/components/admin/BlogManager';
import GalleryManager from '@/components/admin/GalleryManager';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import WorkingHoursManager from '@/components/admin/WorkingHoursManager';
import BlockedDatesManager from '@/components/admin/BlockedDatesManager';
import SettingsManager from '@/components/admin/SettingsManager';

export default function DoctorPage() {
  const [authenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('admin-token');
    }
    return false;
  });
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const handleLogin = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    window.location.reload();
  };

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <AppointmentsManager />;
      case 'services':
        return <ServicesManager />;
      case 'blog':
        return <BlogManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'working-hours':
        return <WorkingHoursManager />;
      case 'blocked-dates':
        return <BlockedDatesManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout
      currentView={currentView}
      onNavigate={setCurrentView}
      onLogout={handleLogout}
    >
      {renderView()}
    </AdminLayout>
  );
}
