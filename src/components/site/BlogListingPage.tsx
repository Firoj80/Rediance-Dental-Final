'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowRight, Newspaper } from 'lucide-react'
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
      <section className="page-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <span className="section-label text-teal mb-3 block">Blog</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-heading tracking-tight">
            Our Blog
          </h1>
          <p className="text-body text-[15px] mt-2">
            Tips, guides, and news about dental health and wellness.
          </p>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="py-10 lg:py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-11 pr-4 text-sm rounded-xl border border-border-subtle bg-surface-low focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 transition-colors text-foreground placeholder:text-subtle"
              />
            </div>
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={
                      `px-4 py-2 text-sm font-medium transition-all duration-200 rounded
                      ${activeCategory === cat
                        ? 'bg-teal text-teal-text'
                        : 'text-body hover:text-teal'
                      }`
                    }
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {clinicLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl bg-surface-variant" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filtered.map((post, i) => (
                <article
                  key={post.id}
                  onClick={() => { window.location.hash = `#/blog/${post.slug}` }}
                  className={
                    `bg-surface-low rounded-xl border border-border-subtle overflow-hidden card-hover
                    flex flex-col sm:flex-row cursor-pointer group
                    transition-all duration-500
                    ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
                  }
                  style={{ transitionDelay: `${(i % 6) * 80}ms` }}
                >
                  {/* Image side */}
                  <div className="sm:w-56 h-44 sm:h-auto bg-surface-high flex-shrink-0">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-high flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-surface-variant" />
                      </div>
                    )}
                  </div>

                  {/* Content side */}
                  <div className="p-5 sm:p-6 flex flex-col justify-center">
                    {post.category && (
                      <span className="text-teal text-[10px] font-bold uppercase tracking-wider mb-2">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-base font-semibold text-heading line-clamp-2 group-hover:text-teal transition-colors cursor-pointer mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs text-subtle mb-3">
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
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-dark transition-colors">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <p className="text-subtle text-sm">No articles found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
