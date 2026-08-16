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
            <Skeleton className="h-3 w-20 mb-3 mx-auto" />
            <Skeleton className="h-9 w-96 max-w-full mb-3 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </section>
        <section className="py-10 lg:py-14 bg-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10 space-y-4">
            <Skeleton className="h-72 lg:h-96 rounded-2xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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
            <span className="section-label text-emerald-600 mb-3 block">Blog</span>
          </div>
        </section>
        <div className="min-h-[60vh] flex items-center justify-center bg-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h1>
            <p className="text-slate-400 text-sm mb-6">The article you are looking for does not exist.</p>
            <button
              onClick={() => { window.location.hash = '#/blog' }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
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
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog
            </button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {post.author && (
              <span className="flex items-center gap-1.5 text-slate-500">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-slate-500">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            {post.category && (
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                {post.category}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="animate-fade-up">
            {post.featuredImage && (
              <div className="rounded-2xl overflow-hidden h-64 lg:h-96 mb-8">
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
                <Separator className="my-8" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(',').map((tag: string) => (
                    <span
                      key={tag.trim()}
                      className="bg-slate-100 text-slate-500 text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </>
            )}

            <Separator className="my-8" />

            {/* CTA Card */}
            <div className="bg-emerald-50 rounded-2xl p-8 sm:p-10 text-center border border-emerald-100/50">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to take care of your smile?</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
                Book an appointment with us today and experience the difference.
              </p>
              <button
                onClick={() => { window.location.hash = '#/book' }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full px-8 h-12 text-sm transition-all shadow-lg shadow-emerald-700/15 hover:shadow-xl hover:-translate-y-0.5"
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