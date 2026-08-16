'use client'

import { useState, useRef } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminFetch } from '@/lib/admin-fetch'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type ImageUploaderProps = {
  value: string | null
  onChange: (url: string | null) => void
  category: 'logo' | 'favicon' | 'gallery' | 'blog' | 'doctor' | 'testimonial'
  label: string
  className?: string
  previewClassName?: string
  hint?: string
}

export function ImageUploader({
  value,
  onChange,
  category,
  label,
  className,
  previewClassName,
  hint,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    // Validate type
    const allowed = [
      'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon',
    ]
    if (!allowed.includes(file.type)) {
      toast.error('Invalid file type. Use PNG, JPG, WebP, GIF, SVG, or ICO.')
      return
    }
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum 5MB.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)

      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      // Remove the Content-Type header that adminFetch sets
      // We need to override the default headers
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Upload failed')
        return
      }

      const data = await res.json()
      onChange(data.url)
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleRemove = () => {
    onChange(null)
  }

  const accept = '.png,.jpg,.jpeg,.webp,.gif,.svg,.ico'

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">{label}</label>

      {value ? (
        <div className="relative group">
          <div className={cn(
            'relative overflow-hidden rounded-lg border bg-muted/30 flex items-center justify-center',
            previewClassName
          )}>
            <img
              src={value}
              alt={label}
              className="object-contain w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">{value}</p>
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF, SVG, ICO (max 5MB)</p>
              </div>
            </>
          )}
        </div>
      )}

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}