'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Loader2, CalendarOff, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type Session = {
  id?: string;
  startTime: string;
  endTime: string;
};

type WorkingHour = {
  id: string;
  dayOfWeek: number;
  enabled: boolean;
  sessions: { id: string; startTime: string; endTime: string }[];
};

export default function WorkingHoursManager() {
  const [hours, setHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchHours = useCallback(async () => {
    try {
      const res = await adminFetch('/api/working-hours');
      const data = await res.json();
      setHours(data);
    } catch {
      toast.error('Failed to load working hours');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHours();
  }, [fetchHours]);

  const ensureDay = (dayOfWeek: number): WorkingHour => {
    const existing = hours.find((h) => h.dayOfWeek === dayOfWeek);
    if (existing) return existing;
    return { id: '', dayOfWeek, enabled: false, sessions: [] };
  };

  const toggleEnabled = (dayOfWeek: number) => {
    setHours((prev) => {
      const existing = prev.find((h) => h.dayOfWeek === dayOfWeek);
      if (existing) {
        return prev.map((h) =>
          h.dayOfWeek === dayOfWeek ? { ...h, enabled: !h.enabled } : h
        );
      }
      return [...prev, { id: '', dayOfWeek, enabled: true, sessions: [{ id: '', startTime: '09:00', endTime: '17:00' }] }];
    });
  };

  const addSession = (dayOfWeek: number) => {
    setHours((prev) =>
      prev.map((h) => {
        if (h.dayOfWeek !== dayOfWeek) return h;
        const lastEnd = h.sessions.length > 0 ? h.sessions[h.sessions.length - 1].endTime : '09:00';
        return {
          ...h,
          sessions: [...h.sessions, { id: '', startTime: lastEnd, endTime: '17:00' }],
        };
      })
    );
  };

  const removeSession = (dayOfWeek: number, sessionIdx: number) => {
    setHours((prev) =>
      prev.map((h) => {
        if (h.dayOfWeek !== dayOfWeek) return h;
        return {
          ...h,
          sessions: h.sessions.filter((_, i) => i !== sessionIdx),
        };
      })
    );
  };

  const updateSession = (dayOfWeek: number, sessionIdx: number, field: 'startTime' | 'endTime', value: string) => {
    setHours((prev) =>
      prev.map((h) => {
        if (h.dayOfWeek !== dayOfWeek) return h;
        const sessions = [...h.sessions];
        sessions[sessionIdx] = { ...sessions[sessionIdx], [field]: value };
        return { ...h, sessions };
      })
    );
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const body = DAYS.map((_, idx) => {
        const day = ensureDay(idx);
        return {
          dayOfWeek: idx,
          enabled: day.enabled,
          sessions: day.sessions.map((s) => ({
            id: s.id,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        };
      });
      await adminFetch('/api/working-hours', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      toast.success('Working hours saved');
      fetchHours();
    } catch {
      toast.error('Failed to save working hours');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  const offDaysCount = DAYS.filter((_, idx) => !ensureDay(idx).enabled).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
        <CalendarOff className="w-4 h-4 shrink-0" />
        <span>
          Toggle a day <strong>off</strong> to make it a <strong>recurring weekly off day</strong>.
          Patients won&apos;t be able to book on that day every week.
          {offDaysCount > 0 && (
            <Badge variant="secondary" className="ml-2">{offDaysCount} off day{offDaysCount > 1 ? 's' : ''}</Badge>
          )}
        </span>
      </div>

      <div className="space-y-3">
        {DAYS.map((day, idx) => {
          const wh = ensureDay(idx);
          return (
            <div key={day} className={cn(
              'rounded-lg border p-4 transition-colors',
              !wh.enabled && 'bg-muted/30 border-dashed'
            )}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={wh.enabled}
                    onCheckedChange={() => toggleEnabled(idx)}
                  />
                  <span className={`font-medium text-sm ${!wh.enabled ? 'text-muted-foreground' : ''}`}>
                    {day}
                  </span>
                  {!wh.enabled && (
                    <Badge variant="outline" className="text-xs bg-destructive/5 text-destructive border-destructive/20">
                      <CalendarOff className="w-3 h-3 mr-1" />
                      Weekly Off
                    </Badge>
                  )}
                </div>
                {wh.enabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addSession(idx)}
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add Session
                  </Button>
                )}
              </div>
              {wh.enabled && (
                <div className="space-y-2 ml-9">
                  {wh.sessions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No sessions. Add one above.</p>
                  ) : (
                    wh.sessions.map((session, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <Label className="text-xs w-14 shrink-0">From</Label>
                        <Input
                          type="time"
                          value={session.startTime}
                          onChange={(e) => updateSession(idx, sIdx, 'startTime', e.target.value)}
                          className="h-8 w-28"
                        />
                        <Label className="text-xs w-10 shrink-0">To</Label>
                        <Input
                          type="time"
                          value={session.endTime}
                          onChange={(e) => updateSession(idx, sIdx, 'endTime', e.target.value)}
                          className="h-8 w-28"
                        />
                        {wh.sessions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeSession(idx, sIdx)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button onClick={saveAll} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All
        </Button>
      </div>
    </div>
  );
}

