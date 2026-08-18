'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CalendarDays, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  service?: { name: string } | null;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
};

const statusColor: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-teal-100 text-teal-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  'No Show': 'bg-gray-100 text-gray-800',
};

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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
  const todayAppts = appointments.filter((a) => a.appointmentDate === today);
  const pending = appointments.filter((a) => a.status === 'Pending');
  const confirmed = appointments.filter((a) => a.status === 'Confirmed');
  const completed = appointments.filter((a) => a.status === 'Completed');

  // Upcoming: today+future, not cancelled/no-show/completed, sorted asc
  const upcoming = appointments
    .filter(
      (a) =>
        a.appointmentDate >= today &&
        !['Cancelled', 'No Show', 'Completed'].includes(a.status)
    )
    .sort(
      (a, b) =>
        a.appointmentDate.localeCompare(b.appointmentDate) ||
        a.appointmentTime.localeCompare(b.appointmentTime)
    )
    .slice(0, 10);

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

  const statCards = [
    { label: "Today's Appointments", value: todayAppts.length, icon: CalendarDays, color: 'text-primary' },
    { label: 'Pending', value: pending.length, icon: AlertCircle, color: 'text-amber-600' },
    { label: 'Confirmed', value: confirmed.length, icon: Clock, color: 'text-teal-600' },
    { label: 'Completed', value: completed.length, icon: CheckCircle2, color: 'text-green-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-4 w-28" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-12" /></CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No upcoming appointments
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden sm:table-cell">Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="text-sm">{appt.appointmentDate}</TableCell>
                    <TableCell className="text-sm">{appt.appointmentTime}</TableCell>
                    <TableCell className="font-medium text-sm">{appt.patientName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {appt.service?.name || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColor[appt.status] || ''}>
                        {appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {appt.status === 'Pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => updateStatus(appt.id, 'Confirmed')}
                        >
                          Confirm
                        </Button>
                      )}
                      {appt.status === 'Confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => updateStatus(appt.id, 'Completed')}
                        >
                          Complete
                        </Button>
                      )}
                      {['Pending', 'Confirmed'].includes(appt.status) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 text-destructive hover:text-destructive"
                          onClick={() => updateStatus(appt.id, 'Cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
