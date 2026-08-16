'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowRight, CalendarDays } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteStore } from '@/lib/store'
import { useInView } from '@/hooks/use-in-view'

export function BlogListingPage() {
  const blogPosts = useSiteStore((s) => s.blogPosts)
  const clinicLoading = useSiteStore((s) => s.clinicLoading)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const { ref, inView } = useInView()

  const categories = useMemo(() => {
    const cats = new Set<string>()
    blogPosts.forEach((post) => {
      if (post.category) cats.add(post.category)
    })
    return ['all', ...Array.from(cats)]
  }, [blogPosts])

  const filtered = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content?.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [blogPosts, search, activeCategory])

  return (
    <div className="pt-20">
      {/* Compact Page Header */}
      <section className="bg-white border-b border-slate-100 py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label text-emerald-600 mb-3 block">Blog</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Our Blog
          </h1>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors placeholder:text-slate-400"
              />
            </div>
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      px-4 py-2 text-sm font-medium transition-colors rounded-full
                      ${activeCategory === cat
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                      }
                    `}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {clinicLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.map((post, i) => (
                <article
                  key={post.id}
                  onClick={() => { window.location.hash = `#/blog/${post.slug}` }}
                  className={`
                    bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover
                    flex flex-col sm:flex-row cursor-pointer
                    transition-all duration-500
                    ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ transitionDelay: `${(i % 6) * 80}ms` }}
                >
                  {/* Image side */}
                  <div className="sm:w-56 h-44 sm:h-auto bg-slate-100 flex-shrink-0">
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
                    <h2 className="text-base font-semibold text-slate-900 line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer mb-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-slate-400 mb-3">
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
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400 text-sm">No articles found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}