import { useState } from 'react';
import Image from 'next/image';
import { getBlogPosts, getLatestPosts, BlogPost } from '../blogData';
import { useStaggeredReveal, ArrowIcon } from '../shared';
import { useClinic } from '../context/ClinicContext';

const BLOG_CATEGORIES = [
  'All',
  'Oral Hygiene',
  'Implants',
  'Cosmetic',
  'Endodontics',
  'Emergency',
  'Family Care',
];

const inputClass =
  'w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors duration-200';

export function BlogPage() {
  const { clinicData: BUSINESS } = useClinic();
  const BLOG_POSTS = getBlogPosts(BUSINESS);
  const LATEST_POSTS = getLatestPosts(BUSINESS);
  const reveal = useStaggeredReveal(6);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [category, setCategory] = useState('All');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    author: '',
    content: '',
  });

  const filtered =
    category === 'All'
      ? LATEST_POSTS
      : LATEST_POSTS.filter((p) => p.category === category);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  // ============ SINGLE POST VIEW ============
  if (selectedPost) {
    return (
      <section className="min-h-screen w-full flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-8 md:pb-12">
        <article className="max-w-3xl mx-auto w-full">
          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-neutral-500 transition-colors duration-200"
          >
            <ArrowIcon className="rotate-[135deg]" />
            Back to all posts
          </button>

          <div className="mt-4 rounded-xl md:rounded-2xl overflow-hidden relative h-56 md:h-80">
            <Image
              src={selectedPost.image}
              alt={selectedPost.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          <div className="mt-5 md:mt-7 flex flex-wrap items-center gap-2 text-[11px] md:text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            <span className="bg-stone-100 border border-neutral-200 rounded-full px-3 py-1">
              {selectedPost.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span>{selectedPost.readTime}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span>{selectedPost.date}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-[1.05] tracking-tight text-black mt-3 md:mt-4">
            {selectedPost.title}
          </h1>

          <p className="text-sm font-medium text-neutral-500 mt-3 md:mt-4">
            By {selectedPost.author}
          </p>

          <div className="mt-5 md:mt-7 space-y-4 md:space-y-5">
            {selectedPost.content.map((para, i) => (
              <p
                key={i}
                className="text-sm md:text-base font-medium text-black/80 leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-8 md:mt-10 rounded-xl md:rounded-2xl bg-black p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Questions about this topic?
              </h3>
              <p className="text-sm text-neutral-400 mt-1.5">
                Ask {selectedPost.author} at your next visit.
              </p>
            </div>
            <a
              href="/book"
              className="px-6 py-3.5 bg-white rounded-full text-black text-sm md:text-base font-bold hover:scale-105 transition-transform shrink-0"
            >
              Book Appointment
            </a>
          </div>
        </article>
      </section>
    );
  }

  // ============ BLOG LISTING VIEW ============
  return (
    <section
      ref={reveal.containerRef}
      className="min-h-screen w-full flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="flex flex-col gap-1.5 md:gap-2">
        {/* Header */}
        <div
          className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4 min-h-[190px]"
          style={reveal.getAnimStyle(0)}
        >
          <div>
            <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
              Dental insights
            </p>
            <h1 className="text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-black">
              Our
              <br />
              Blog
            </h1>
          </div>
          <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5 max-w-[260px] md:text-right">
            Practical advice on oral hygiene, treatments and emergencies —
            written by {BLOG_POSTS[0].author}.
          </p>
        </div>

        {/* Category filter */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
          style={reveal.getAnimStyle(1)}
        >
          {BLOG_CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-colors duration-200 ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-neutral-200 hover:border-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2">
          {filtered.map((post, i) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group rounded-xl md:rounded-2xl overflow-hidden text-left flex flex-col min-h-[360px]"
              style={reveal.getAnimStyle(Math.min(i + 2, 5))}
            >
              <div className="relative h-48 md:h-56 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="flex-1 bg-stone-50 p-4 md:p-5 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                    {post.date} · {post.readTime}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-black leading-6 md:leading-7 mt-2 md:mt-3 group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-neutral-500 leading-4 md:leading-5 mt-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">
                    By {post.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black">
                    Read
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1">
                      <path
                        d="M1 7h12m0 0L8 2m5 5L8 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Write a blog post */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2"
          style={reveal.getAnimStyle(3)}
        >
          <div className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex flex-col justify-between gap-4 min-h-[220px]">
            <div>
              <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
                Share your experience
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-black leading-[1.05]">
                Write a
                <br />
                Blog Post
              </h2>
              <p className="text-xs md:text-sm font-medium text-black leading-4 md:leading-5 mt-3 md:mt-4 max-w-[300px]">
                Have a dental story, tip or question worth sharing? Submit it
                here and our team will review and publish it.
              </p>
            </div>
          </div>

          <div className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7">
            {submitted ? (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-black">
                  Post submitted!
                </h3>
                <p className="text-xs md:text-sm font-medium text-neutral-600 leading-4 leading-5 max-w-[300px]">
                  Thank you for your contribution. Our team will review it and
                  be in touch.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-6 py-3 border border-black rounded-full text-sm font-semibold text-black hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Write another post
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="flex flex-col gap-3 md:gap-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-black mb-1.5">
                    Post Title
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={update('title')}
                    placeholder="e.g. My experience with teeth whitening"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1.5">
                    Your Name
                  </label>
                  <input
                    required
                    value={form.author}
                    onChange={update('author')}
                    placeholder="Your display name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1.5">
                    Content
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.content}
                    onChange={update('content')}
                    placeholder="Tell your story or share your tip..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-1 px-8 py-4 bg-black rounded-full text-white text-sm md:text-base font-bold hover:bg-neutral-800 transition-colors duration-200"
                >
                  Submit Post
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
