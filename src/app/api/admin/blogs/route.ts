import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const blogCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  featuredImage: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
})

const blogUpdateSchema = blogCreateSchema.partial().omit({ slug: true })

export async function GET(_request: Request) {
  try {
    requireAuth(_request)

    const blogs = await db.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(blogs)
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error fetching admin blogs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    requireAuth(request)

    const body = await request.json()
    const parsed = blogCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const clinic = await db.clinic.findFirst()
    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    const blog = await db.blogPost.create({
      data: {
        clinicId: clinic.id,
        ...parsed.data,
        featuredImage: parsed.data.featuredImage ?? undefined,
        content: parsed.data.content ?? undefined,
        category: parsed.data.category ?? undefined,
        tags: parsed.data.tags ?? undefined,
        author: parsed.data.author ?? undefined,
        publishedAt: parsed.data.published
          ? parsed.data.publishedAt
            ? new Date(parsed.data.publishedAt)
            : new Date()
          : null,
        seoTitle: parsed.data.seoTitle ?? undefined,
        seoDescription: parsed.data.seoDescription ?? undefined,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    requireAuth(request)

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const { id, ...updateData } = body
    const parsed = blogUpdateSchema.safeParse(updateData)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const blog = await db.blogPost.update({
      where: { id },
      data: {
        ...parsed.data,
        featuredImage: parsed.data.featuredImage ?? undefined,
        content: parsed.data.content ?? undefined,
        category: parsed.data.category ?? undefined,
        tags: parsed.data.tags ?? undefined,
        author: parsed.data.author ?? undefined,
        publishedAt: parsed.data.published
          ? parsed.data.publishedAt
            ? new Date(parsed.data.publishedAt)
            : new Date()
          : null,
        seoTitle: parsed.data.seoTitle ?? undefined,
        seoDescription: parsed.data.seoDescription ?? undefined,
      },
    })

    return NextResponse.json(blog)
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error('Error updating blog:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
