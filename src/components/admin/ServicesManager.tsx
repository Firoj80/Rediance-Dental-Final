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
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

type Service = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  image: string | null;
  price: number | null;
  duration: number;
  featured: boolean;
  active: boolean;
  displayOrder: number;
};

const emptyForm = {
  name: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  image: '',
  price: '',
  duration: '30',
  featured: false,
  active: true,
  displayOrder: '0',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/services');
      const data = await res.json();
      setServices(data);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription || '',
      fullDescription: s.fullDescription || '',
      image: s.image || '',
      price: s.price !== null ? String(s.price) : '',
      duration: String(s.duration),
      featured: s.featured,
      active: s.active,
      displayOrder: String(s.displayOrder),
    });
    setDialogOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        slug: form.slug,
        shortDescription: form.shortDescription || null,
        fullDescription: form.fullDescription || null,
        image: form.image || null,
        price: form.price ? Number(form.price) : null,
        duration: Number(form.duration),
        featured: form.featured,
        active: form.active,
        displayOrder: Number(form.displayOrder),
      };

      if (editing) {
        await adminFetch('/api/admin/services', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, ...body }),
        });
        toast.success('Service updated');
      } else {
        await adminFetch('/api/admin/services', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        toast.success('Service created');
      }
      setDialogOpen(false);
      fetchServices();
    } catch {
      toast.error('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s: Service) => {
    try {
      await adminFetch('/api/admin/services', {
        method: 'PUT',
        body: JSON.stringify({ id: s.id, active: !s.active }),
      });
      toast.success(s.active ? 'Service deactivated' : 'Service activated');
      fetchServices();
    } catch {
      toast.error('Failed to toggle service');
    }
  };

  const deleteService = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/admin/services/${deleteId}`, { method: 'DELETE' });
      toast.success('Service deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        <Button onClick={openNew} size="sm">
          <Plus className="mr-1.5 h-4 w-4" /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No services yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="hidden sm:table-cell">Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-sm">
                  {s.name}
                  {s.featured && (
                    <Badge variant="secondary" className="ml-2 bg-teal-100 text-teal-800">
                      Featured
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono">
                  {s.slug}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  {s.price !== null ? `₹${s.price}` : '—'}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">
                  {s.duration} min
                </TableCell>
                <TableCell>
                  <Switch checked={s.active} onCheckedChange={() => toggleActive(s)} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteId(s.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })
                }
                placeholder="Service name"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="service-slug"
                disabled={!!editing}
              />
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Full Description</Label>
              <Textarea
                value={form.fullDescription}
                onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
            <ImageUploader
              value={form.image || null}
              onChange={(url) => setForm({ ...form, image: url || '' })}
              category="service"
              label="Service Image"
              previewClassName="h-40"
              hint="Upload an image or paste a URL for the service"
            />
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                Active
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving || !form.name.trim()}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteService} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
