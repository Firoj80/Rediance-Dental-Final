'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CalendarDays, User, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
        <section className="bg-primary py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-96 max-w-full mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
        </section>
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-64 rounded-xl" />
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
      <div className="pt-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you are looking for does not exist.</p>
          <Button variant="outline" onClick={() => { window.location.hash = '#/blog' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => { window.location.hash = '#/blog' }}
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Articles
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            {post.category && (
              <Badge className="bg-white/10 text-white/80 hover:bg-white/20 border-0 text-xs">
                <Tag className="w-3 h-3" />
                {post.category}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-up">
            {post.featuredImage && (
              <div className="rounded-xl overflow-hidden mb-10">
                <img src={post.featuredImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
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
                    <Badge key={tag.trim()} variant="outline" className="text-xs">
                      #{tag.trim()}
                    </Badge>
                  ))}
                </div>
              </>
            )}

            <Separator className="my-8" />

            <div className="text-center">
              <Button
                onClick={() => { window.location.hash = '#/book' }}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Book an Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
