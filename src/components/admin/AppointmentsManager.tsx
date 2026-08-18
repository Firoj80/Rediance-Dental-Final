'use client';

import { Fragment, useEffect, useState, useMemo } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, ChevronLeft, ChevronRight, Phone, Mail, MessageSquare } from 'lucide-react';

type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  patientMessage: string | null;
  service?: { name: string } | null;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt: string;
};

const statusColor: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-teal-100 text-teal-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  'No Show': 'bg-gray-100 text-gray-800',
};

const TABS = ['All', 'Today', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'] as const;
type Tab = (typeof TABS)[number];
const PAGE_SIZE = 10;

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('All');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await adminFetch('/api/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (tab === 'Today') list = list.filter((a) => a.appointmentDate === today);
    else if (tab !== 'All') list = list.filter((a) => a.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.patientName.toLowerCase().includes(q));
    }
    return list.sort(
      (a, b) =>
        b.appointmentDate.localeCompare(a.appointmentDate) ||
        a.appointmentTime.localeCompare(b.appointmentTime)
    );
  }, [appointments, tab, search, today]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [tab, search]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminFetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="flex-wrap h-auto gap-1">
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t} className="text-xs">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No appointments found</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((appt) => (
                <Fragment key={appt.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => setExpanded(expanded === appt.id ? null : appt.id)}
                  >
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {appt.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{appt.patientName}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{appt.patientPhone}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {appt.service?.name || '—'}
                    </TableCell>
                    <TableCell className="text-sm">{appt.appointmentDate}</TableCell>
                    <TableCell className="text-sm">{appt.appointmentTime}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColor[appt.status] || ''}>
                        {appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateStatus(appt.id, 'Confirmed')}>
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appt.id, 'Completed')}>
                            Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appt.id, 'Cancelled')}>
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appt.id, 'No Show')}>
                            No Show
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expanded === appt.id && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={8} className="bg-muted/30">
                        <div className="py-3 px-2 text-sm space-y-2">
                          <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{appt.patientPhone}</span>
                            {appt.patientEmail && (
                              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{appt.patientEmail}</span>
                            )}
                          </div>
                          {appt.patientMessage && (
                            <div className="flex items-start gap-1.5 text-muted-foreground">
                              <MessageSquare className="h-3.5 w-3.5 mt-0.5" />
                              {appt.patientMessage}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Booked: {new Date(appt.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filtered.length} appointment{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center px-3 text-sm">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
