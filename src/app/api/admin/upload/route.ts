import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Allowed file types per category
const ALLOWED_TYPES: Record<string, string[]> = {
  logo: ['image/png', 'image/svg+xml', 'image/jpeg', 'image/webp'],
  favicon: ['image/png', 'image/svg+xml', 'image/x-icon', 'image/jpeg'],
  gallery: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  blog: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  doctor: ['image/png', 'image/jpeg', 'image/webp'],
  testimonial: ['image/png', 'image/jpeg', 'image/webp'],
  service: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'],
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/x-icon': '.ico',
  }
  return map[mimeType] || '.png'
}

export async function POST(request: Request) {
  try {
    const authError = await checkAuth(request)
    if (authError) return authError

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = (formData.get('category') as string) || 'gallery'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate category
    const allowedForCategory = ALLOWED_TYPES[category]
    if (!allowedForCategory) {
      return NextResponse.json(
        { error: `Invalid category. Allowed: ${Object.keys(ALLOWED_TYPES).join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file type
    if (!allowedForCategory.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed: ${allowedForCategory.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', category)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = getExtension(file.type)
    const filename = `${timestamp}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const filepath = join(uploadDir, filename)

    // Write file
    const bytes = new Uint8Array(await file.arrayBuffer())
    await writeFile(filepath, bytes)

    const url = `/uploads/${category}/${filename}`

    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type,
      category,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
