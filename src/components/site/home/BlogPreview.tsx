'use client'

import { ArrowRight, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function BlogPreview() {
  const blogPosts = useSiteStore((s) => s.blogPosts)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  if (clinicLoading || blogPosts.length === 0) return null

  const latestPosts = blogPosts.slice(0, 3)

  return (
    <section className="py-16 lg:py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Latest from Our Blog</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tips, news, and insights about dental health.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post, i) => (
            <article
              key={post.id}
              className={`card-hover bg-white rounded-xl border overflow-hidden transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {post.featuredImage ? (
                <div className="img-zoom">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-teal-50 flex items-center justify-center">
                  <CalendarDays className="w-10 h-10 text-teal-200" />
                </div>
              )}
              <div className="p-5">
                {post.category && (
                  <Badge variant="secondary" className="text-xs mb-2">{post.category}</Badge>
                )}
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </p>
                <button
                  onClick={() => { window.location.hash = `#/blog/${post.slug}` }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {blogPosts.length > 3 && (
          <div className="text-center mt-10">
            <Button variant="outline" onClick={() => { window.location.hash = '#/blog' }}>
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
