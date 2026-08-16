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
    <section className="py-20 lg:py-28 bg-slate-50/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
          <div className="max-w-xl">
            <span className="section-label text-emerald-600 mb-3 block">Blog</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3 leading-tight">
              Latest from Our Blog
            </h2>
            <p className="text-slate-500 leading-relaxed text-[15px]">
              Tips, guides, and news about dental health and wellness.
            </p>
          </div>
          <button
            onClick={() => { window.location.hash = '#/blog' }}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors shrink-0"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Blog Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post, i) => (
            <article
              key={post.id}
              onClick={() => { window.location.hash = `#/blog/${post.slug}` }}
              className={
                `bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer group
                hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
              }
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Image */}
              {post.featuredImage ? (
                <div className="h-48 overflow-hidden">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-slate-50 to-emerald-50/30 flex items-center justify-center">
                  <Newspaper className="w-10 h-10 text-slate-200" />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {post.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                )}
                <h3 className="text-base font-semibold text-slate-900 mt-3 mb-3 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between">
                  {post.publishedAt && (
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
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
