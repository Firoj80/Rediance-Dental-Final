'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  FileText,
  Image,
  MessageSquareQuote,
  Clock,
  CalendarX,
  Settings,
  LogOut,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export type AdminView =
  | 'dashboard'
  | 'appointments'
  | 'services'
  | 'blog'
  | 'gallery'
  | 'testimonials'
  | 'working-hours'
  | 'blocked-dates'
  | 'settings';

const navItems: { id: AdminView; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'services', label: 'Services', icon: Scissors },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { id: 'working-hours', label: 'Working Hours', icon: Clock },
  { id: 'blocked-dates', label: 'Blocked Dates', icon: CalendarX },
  { id: 'settings', label: 'Settings', icon: Settings },
];

type AdminSidebarProps = {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
  onLogout: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AdminSidebar({
  currentView,
  onNavigate,
  onLogout,
  open,
  onOpenChange,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm truncate">Radiance Dental</span>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onOpenChange(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
