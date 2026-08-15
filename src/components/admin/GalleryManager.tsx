'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Trash2, ImageIcon } from 'lucide-react';

type GalleryImage = {
  id: string;
  title: string | null;
  image: string;
  category: string | null;
  displayOrder: number;
  visible: boolean;
};

const CATEGORIES = ['Clinic', 'Doctor', 'Team', 'Treatment', 'Facilities', 'Other'];

const emptyForm = {
  title: '',
  image: '',
  category: 'Clinic',
  displayOrder: '0',
  visible: true,
};

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/gallery');
      const data = await res.json();
      setImages(data);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const save = async () => {
    if (!form.image.trim()) {
      toast.error('Image URL is required');
      return;
    }
    setSaving(true);
    try {
      await adminFetch('/api/admin/gallery', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title || null,
          image: form.image,
          category: form.category || null,
          displayOrder: Number(form.displayOrder),
          visible: form.visible,
        }),
      });
      toast.success('Image uploaded');
      setDialogOpen(false);
      setForm(emptyForm);
      fetchImages();
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (img: GalleryImage) => {
    try {
      await adminFetch('/api/admin/gallery', {
        method: 'PUT',
        body: JSON.stringify({ id: img.id, visible: !img.visible }),
      });
      toast.success(img.visible ? 'Image hidden' : 'Image visible');
      fetchImages();
    } catch {
      toast.error('Failed to toggle visibility');
    }
  };

  const deleteImage = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/admin/gallery/${deleteId}`, { method: 'DELETE' });
      toast.success('Image deleted');
      fetchImages();
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{images.length} image{images.length !== 1 ? 's' : ''}</p>
        <Button onClick={() => { setForm(emptyForm); setDialogOpen(true); }} size="sm">
          <Plus className="mr-1.5 h-4 w-4" /> Upload Image
        </Button>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No gallery images yet</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`group relative aspect-square rounded-lg border bg-muted overflow-hidden ${!img.visible ? 'opacity-50' : ''}`}
            >
              {img.image ? (
                <img
                  src={img.image}
                  alt={img.title || ''}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white font-medium truncate">{img.title || 'Untitled'}</p>
                  {img.category && (
                    <p className="text-xs text-white/70">{img.category}</p>
                  )}
                  <div className="flex gap-1 mt-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => toggleVisible(img)}
                    >
                      {img.visible ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setDeleteId(img.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Image title"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
              Visible
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving || !form.image.trim()}>
                {saving ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteImage} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
