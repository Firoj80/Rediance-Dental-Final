'use client'

import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'
import { CalendarDays, ArrowRight } from 'lucide-react'

export function BlogPreview() {
  const blogPosts = useSiteStore((s) => s.blogPosts)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  if (clinicLoading || blogPosts.length === 0) return null

  const latestPosts = blogPosts.slice(0, 3)

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="section-label text-emerald-600 mb-3 block">Blog</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Tips, guides, and news about dental health.
          </p>
        </div>

        {/* Blog Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latestPosts.map((post, i) => (
            <article
              key={post.id}
              onClick={() => { window.location.hash = `#/blog/${post.slug}` }}
              className={`
                bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer
                hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Image */}
              {post.featuredImage ? (
                <div className="h-44 overflow-hidden">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-44 bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
                  <span className="text-4xl text-emerald-100">📰</span>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {post.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                )}
                <h3 className="text-base font-semibold text-slate-900 mt-3 mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between">
                  {post.publishedAt && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { window.location.hash = '#/blog' }}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
