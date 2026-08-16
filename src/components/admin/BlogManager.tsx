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
import { Badge } from '@/components/ui/badge';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  content: string | null;
  category: string | null;
  tags: string | null;
  author: string | null;
  published: boolean;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
};

const emptyForm = {
  title: '',
  slug: '',
  featuredImage: '',
  content: '',
  category: '',
  tags: '',
  author: '',
  published: false,
  seoTitle: '',
  seoDescription: '',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/blogs');
      const data = await res.json();
      setPosts(data);
    } catch {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      featuredImage: p.featuredImage || '',
      content: p.content || '',
      category: p.category || '',
      tags: p.tags || '',
      author: p.author || '',
      published: p.published,
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
    });
    setDialogOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        slug: form.slug,
        featuredImage: form.featuredImage || null,
        content: form.content || null,
        category: form.category || null,
        tags: form.tags || null,
        author: form.author || null,
        published: form.published,
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
      };

      if (editing) {
        await adminFetch('/api/admin/blogs', {
          method: 'PUT',
          body: JSON.stringify({ id: editing.id, ...body }),
        });
        toast.success('Post updated');
      } else {
        await adminFetch('/api/admin/blogs', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        toast.success('Post created');
      }
      setDialogOpen(false);
      fetchPosts();
    } catch {
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (p: BlogPost) => {
    try {
      await adminFetch('/api/admin/blogs', {
        method: 'PUT',
        body: JSON.stringify({ id: p.id, published: !p.published }),
      });
      toast.success(p.published ? 'Post unpublished' : 'Post published');
      fetchPosts();
    } catch {
      toast.error('Failed to toggle publish');
    }
  };

  const deletePost = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/admin/blogs/${deleteId}`, { method: 'DELETE' });
      toast.success('Post deleted');
      fetchPosts();
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        <Button onClick={openNew} size="sm">
          <Plus className="mr-1.5 h-4 w-4" /> New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No blog posts yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id} className="cursor-pointer" onClick={() => openEdit(p)}>
                <TableCell className="font-medium text-sm">
                  {p.title}
                  {p.category && (
                    <Badge variant="outline" className="ml-2 text-xs hidden lg:inline-flex">
                      {p.category}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {p.category || '—'}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {p.author || '—'}
                </TableCell>
                <TableCell>
                  <Switch checked={p.published} onCheckedChange={() => togglePublished(p)} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openEdit(p); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Post' : 'New Post'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })
                }
                placeholder="Post title"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="post-slug"
                disabled={!!editing}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Category"
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="tag1, tag2"
              />
            </div>
            <ImageUploader
              value={form.featuredImage || null}
              onChange={(url) => setForm({ ...form, featuredImage: url || '' })}
              category="blog"
              label="Featured Image"
              previewClassName="h-40"
              hint="Upload a featured image for the blog post"
            />
            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                placeholder="Write your post content in Markdown..."
              />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">SEO</p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    placeholder="Meta title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    rows={2}
                    placeholder="Meta description"
                  />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              Published
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setForm({ ...form, published: false });
                  save();
                }}
                disabled={saving || !form.title.trim()}
              >
                Save Draft
              </Button>
              <Button
                onClick={() => {
                  setForm({ ...form, published: true });
                  save();
                }}
                disabled={saving || !form.title.trim()}
              >
                {saving ? 'Saving...' : 'Publish'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePost} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
