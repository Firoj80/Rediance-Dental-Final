'use client'

import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'
import { CalendarDays, ArrowRight, Newspaper } from 'lucide-react'

export function BlogPreview() {
  const blogPosts = useSiteStore((s) => s.blogPosts)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  if (clinicLoading || blogPosts.length === 0) return null

  const latestPosts = blogPosts.slice(0, 3)

  return (
    <section className="py-16 lg:py-20 bg-surface-dim">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-xl mb-10 mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-heading tracking-tight mb-3 leading-tight uppercase">
            Latest From Our Blog
          </h2>
          <p className="text-body leading-relaxed text-[15px]">
            Tips, guides, and news about dental health and wellness.
          </p>
        </div>

        {/* Blog Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post, i) => (
            <article
              key={post.id}
              onClick={() => { window.location.hash = `#/blog/${post.slug}` }}
              className={
                `bg-surface-low rounded-xl border border-border-subtle overflow-hidden cursor-pointer group card-hover
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
              }
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Image */}
              {post.featuredImage ? (
                <div className="h-48 overflow-hidden img-zoom">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-surface-variant flex items-center justify-center">
                  <Newspaper className="w-10 h-10 text-subtle/40" />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {post.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal bg-teal/10 px-3 py-1 rounded">
                    {post.category}
                  </span>
                )}
                <h3 className="text-base font-semibold text-heading mt-3 mb-3 line-clamp-2 leading-snug group-hover:text-teal transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between">
                  {post.publishedAt && (
                    <span className="text-xs text-subtle flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  <span className="text-xs text-teal font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
