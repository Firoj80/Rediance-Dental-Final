'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';

type BlockedDate = {
  id: string;
  date: string;
  reason: string | null;
};

export default function BlockedDatesManager() {
  const [dates, setDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formDate, setFormDate] = useState('');
  const [formReason, setFormReason] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDates = useCallback(async () => {
    try {
      const res = await adminFetch('/api/blocked-dates');
      const data = await res.json();
      setDates(data);
    } catch {
      toast.error('Failed to load blocked dates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDates();
  }, [fetchDates]);

  const addDate = async () => {
    if (!formDate) {
      toast.error('Date is required');
      return;
    }
    setSaving(true);
    try {
      await adminFetch('/api/blocked-dates', {
        method: 'POST',
        body: JSON.stringify({ date: formDate, reason: formReason || undefined }),
      });
      toast.success('Blocked date added');
      setDialogOpen(false);
      setFormDate('');
      setFormReason('');
      fetchDates();
    } catch (err) {
      toast.error('Failed to add blocked date');
    } finally {
      setSaving(false);
    }
  };

  const deleteDate = async (id: string) => {
    try {
      await adminFetch(`/api/blocked-dates?id=${id}`, { method: 'DELETE' });
      toast.success('Blocked date removed');
      fetchDates();
    } catch {
      toast.error('Failed to remove blocked date');
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {dates.length} blocked date{dates.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={() => { setFormDate(''); setFormReason(''); setDialogOpen(true); }} size="sm">
          <Plus className="mr-1.5 h-4 w-4" /> Add Blocked Date
        </Button>
      </div>

      {dates.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No blocked dates</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dates.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium text-sm">{d.date}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {d.reason || '—'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => deleteDate(d.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Blocked Date</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Input
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                placeholder="e.g. Holiday, Clinic closed"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addDate} disabled={saving || !formDate}>
                {saving ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
