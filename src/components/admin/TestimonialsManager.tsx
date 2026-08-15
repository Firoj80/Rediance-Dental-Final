'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Testimonial = {
  id: string;
  patientName: string;
  review: string;
  rating: number;
  photo: string | null;
  published: boolean;
  displayOrder: number;
};

const emptyForm = {
  patientName: '',
  review: '',
  rating: 5,
  photo: '',
  published: true,
  displayOrder: '0',
};

function Stars({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          onClick={onChange ? () => onChange(i) : undefined}
        />
      ))}
    </div>
  );
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      patientName: t.patientName,
      review: t.review,
      rating: t.rating,
      photo: t.photo || '',
      published: t.published,
      displayOrder: String(t.displayOrder),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        patientName: form.patientName,
        review: form.review,
        rating: form.rating,
        photo: form.photo || null,
        published: form.published,
        displayOrder: Number(form.displayOrder),
      };

      if (editing) {
        await adminFetch('/api/admin/testimonials', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, ...body }),
        });
        toast.success('Testimonial updated');
      } else {
        await adminFetch('/api/admin/testimonials', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        toast.success('Testimonial added');
      }
      setDialogOpen(false);
      fetchTestimonials();
    } catch {
      toast.error('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (t: Testimonial) => {
    try {
      await adminFetch('/api/admin/testimonials', {
        method: 'PUT',
        body: JSON.stringify({ id: t.id, published: !t.published }),
      });
      toast.success(t.published ? 'Testimonial unpublished' : 'Testimonial published');
      fetchTestimonials();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/admin/testimonials/${deleteId}`, { method: 'DELETE' });
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={openNew} size="sm">
          <Plus className="mr-1.5 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No testimonials yet</p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`flex items-start gap-4 rounded-lg border p-4 ${!t.published ? 'opacity-60' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{t.patientName}</span>
                  <Stars rating={t.rating} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.review}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Switch checked={t.published} onCheckedChange={() => togglePublished(t)} />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => setDeleteId(t.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                placeholder="Patient name"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <Stars rating={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
            </div>
            <div className="space-y-2">
              <Label>Review</Label>
              <Textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                rows={4}
                placeholder="Patient review..."
              />
            </div>
            <div className="space-y-2">
              <Label>Photo URL (optional)</Label>
              <Input
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              Published
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.patientName.trim() || !form.review.trim()}
              >
                {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
