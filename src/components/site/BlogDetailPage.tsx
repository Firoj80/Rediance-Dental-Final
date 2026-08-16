'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CalendarDays, User } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import ReactMarkdown from 'react-markdown'

export function BlogDetailPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  useEffect(() => {
    async function fetchPost() {
      setLoading(true)
      setNotFound(false)
      try {
        const res = await fetch(`/api/blogs/${slug}`)
        if (!res.ok) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        setPost(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-20">
        <section className="page-header">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
            <Skeleton className="h-3 w-20 mb-3 mx-auto bg-surface-variant" />
            <Skeleton className="h-9 w-96 max-w-full mb-3 mx-auto bg-surface-variant" />
            <Skeleton className="h-4 w-48 mx-auto bg-surface-variant" />
          </div>
        </section>
        <section className="py-10 lg:py-14 bg-surface">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 space-y-4">
            <Skeleton className="h-72 lg:h-96 rounded-xl bg-surface-variant" />
            <Skeleton className="h-4 w-full bg-surface-variant" />
            <Skeleton className="h-4 w-full bg-surface-variant" />
            <Skeleton className="h-4 w-3/4 bg-surface-variant" />
          </div>
        </section>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="pt-20">
        <section className="page-header">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
            <span className="section-label text-teal mb-3 block">Blog</span>
          </div>
        </section>
        <div className="min-h-[60vh] flex items-center justify-center bg-surface">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-heading mb-2">Article Not Found</h1>
            <p className="text-body text-sm mb-6">The article you are looking for does not exist.</p>
            <button
              onClick={() => { window.location.hash = '#/blog' }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Compact Header with breadcrumb */}
      <section className="page-header">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <div className="mb-4">
            <button
              onClick={() => { window.location.hash = '#/blog' }}
              className="inline-flex items-center gap-1.5 text-sm text-subtle hover:text-teal transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog
            </button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {post.author && (
              <span className="flex items-center gap-1.5 text-body">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-body">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            {post.category && (
              <span className="bg-surface-variant text-body text-xs font-semibold px-3 py-1 rounded">
                {post.category}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 lg:py-12 bg-surface">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="animate-fade-up">
            {post.featuredImage && (
              <div className="rounded-xl overflow-hidden h-64 lg:h-96 mb-8">
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {post.content && (
              <div className="prose-dental">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            )}

            {post.tags && (
              <>
                <Separator className="my-8 border-border-subtle" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(',').map((tag: string) => (
                    <span
                      key={tag.trim()}
                      className="bg-surface-variant text-body text-xs font-medium px-3 py-1.5 rounded"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </>
            )}

            <Separator className="my-8 border-border-subtle" />

            {/* CTA Card */}
            <div className="bg-surface-low rounded-xl p-8 sm:p-10 text-center border border-border-subtle">
              <h3 className="text-xl font-semibold text-heading mb-2">Ready to take care of your smile?</h3>
              <p className="text-sm text-body mb-8 max-w-md mx-auto">
                Book an appointment with us today and experience the difference.
              </p>
              <button
                onClick={() => { window.location.hash = '#/book' }}
                className="bg-teal hover:bg-teal-dark text-teal-text font-semibold rounded px-8 h-12 text-sm transition-all"
              >
                Book an Appointment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}