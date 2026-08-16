'use client'

import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'
import { CalendarDays } from 'lucide-react'

export function BlogPreview() {
  const blogPosts = useSiteStore((s) => s.blogPosts)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const { ref, inView } = useInView()

  if (clinicLoading || blogPosts.length === 0) return null

  const latestPosts = blogPosts.slice(0, 3)

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — Left Aligned */}
        <div className="mb-12">
          <span className="section-label text-emerald-600 mb-3 block">Blog</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Latest from Our Blog
          </h2>
        </div>

        {/* Blog Cards Grid — horizontal cards */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {latestPosts.map((post, i) => (
            <article
              key={post.id}
              onClick={() => { window.location.hash = `#/blog/${post.slug}` }}
              className={`
                bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover
                flex flex-col sm:flex-row cursor-pointer
                transition-all duration-500
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Image side */}
              <div className="sm:w-48 h-40 sm:h-auto bg-slate-100 flex-shrink-0">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
                    <CalendarDays className="w-8 h-8 text-emerald-200" />
                  </div>
                )}
              </div>

              {/* Content side */}
              <div className="p-5 flex flex-col justify-center">
                {post.category && (
                  <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    {post.category}
                  </span>
                )}
                <h3 className="text-base font-semibold text-slate-900 line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                  {post.author && post.publishedAt ? ' · ' : ''}
                  {post.author || ''}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
