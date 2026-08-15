'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowRight, CalendarDays } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Our Blog</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Tips, news, and insights about dental health and wellness.
          </p>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {categories.length > 2 && (
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.slice(1).map((cat) => (
                    <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>

          {clinicLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : (
            <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <article
                  key={post.id}
                  className={`card-hover bg-white rounded-xl border overflow-hidden transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${(i % 6) * 80}ms` }}
                >
                  {post.featuredImage ? (
                    <div className="img-zoom">
                      <img src={post.featuredImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-teal-50 flex items-center justify-center">
                      <CalendarDays className="w-10 h-10 text-teal-200" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {post.category && (
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      )}
                    </div>
                    <h2 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-xs text-muted-foreground mb-3">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      {post.author && ` • ${post.author}`}
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
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No articles found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
