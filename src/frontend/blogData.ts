import { SERVICE_IMAGES } from './shared';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
}

export const getBlogPosts = (BUSINESS: any): BlogPost[] => [
  {
    id: '1',
    slug: 'choosing-right-toothbrush',
    title: 'How to Choose the Right Toothbrush & Toothpaste',
    excerpt:
      'From bristle stiffness to fluoride levels, here is a simple guide to picking the tools that protect your smile every day.',
    category: 'Oral Hygiene',
    author: BUSINESS.doctor,
    date: '12 Mar 2026',
    readTime: '4 min read',
    image: SERVICE_IMAGES.gums,
    content: [
      'Choosing a toothbrush may seem simple, but the wrong choice can do more harm than good. A brush with hard bristles can wear away enamel and irritate your gums, so we always recommend soft or extra-soft bristles for almost everyone.',
      'The head size matters too. A smaller head lets you reach the back molars and the inside surfaces of your teeth more comfortably. Replace your brush or electric brush head every three months — or sooner if the bristles start to splay.',
      'When it comes to toothpaste, look for one that contains fluoride, which strengthens enamel and helps prevent cavities. Avoid abrasive whitening pastes if you have sensitive teeth or receding gums.',
      'Electric and manual brushes both work well if used correctly. The key is a gentle, circular motion at a 45-degree angle for a full two minutes, twice a day. If you are unsure which products suit you best, ask us at your next check-up.',
    ],
  },
  {
    id: '2',
    slug: 'dental-implants-guide',
    title: 'Dental Implants: A Complete Guide',
    excerpt:
      'Everything you need to know about implants — how they work, who they suit, and what to expect from treatment to recovery.',
    category: 'Implants',
    author: BUSINESS.doctor,
    date: '28 Feb 2026',
    readTime: '6 min read',
    image: SERVICE_IMAGES.implants,
    content: [
      'A dental implant is a titanium post placed into the jawbone to replace the root of a missing tooth. Over a few months the bone fuses to it, creating a strong foundation for a crown that looks and feels like a natural tooth.',
      'Implants are the closest thing to your original teeth. Unlike bridges, they do not require altering neighbouring teeth, and unlike dentures, they stay firmly in place while you eat, speak and smile with confidence.',
      'Most healthy adults are good candidates. Good oral hygiene and enough bone to hold the implant are the main requirements. If bone is insufficient, a bone graft can often rebuild it first.',
      'Recovery is usually comfortable with mild soreness for a few days. With proper brushing, flossing and regular check-ups, an implant can last for decades. Come in for an evaluation and we will plan the right approach for your smile.',
    ],
  },
  {
    id: '3',
    slug: 'teeth-whitening-explained',
    title: 'Teeth Whitening: What Really Works',
    excerpt:
      'Bleaching, whitening strips, or charcoal pastes? We break down what is safe, effective, and worth your money.',
    category: 'Cosmetic',
    author: BUSINESS.doctor,
    date: '15 Feb 2026',
    readTime: '5 min read',
    image: SERVICE_IMAGES.whitening,
    content: [
      'Many products promise a whiter smile, but not all of them work — and some can damage your enamel. Professional, in-clinic whitening remains the fastest and most reliable way to noticeably brighten your teeth in a single visit.',
      'At-home trays with a dentist-prescribed gel can also be effective when monitored properly. Over-the-counter strips work gradually for mild staining, while abrasive "charcoal" pastes should be used with caution as they can wear enamel if overused.',
      'Whitening works best on yellowish stains from food, tea, coffee and tobacco. Greyish discolouration or stains caused by medication may respond differently, which is why a professional assessment matters.',
      'Results typically last from several months to a few years depending on your habits. Sensitivity is common but temporary. To keep your smile bright, we can plan touch-ups around your routine check-ups.',
    ],
  },
  {
    id: '4',
    slug: 'facial-trauma-emergency',
    title: 'Facial Trauma: What to Do in an Emergency',
    excerpt:
      'A knocked-out or broken tooth needs fast, correct action. Follow these steps before you reach the clinic.',
    category: 'Emergency',
    author: BUSINESS.doctor,
    date: '30 Jan 2026',
    readTime: '4 min read',
    image: SERVICE_IMAGES.trauma,
    content: [
      'Facial injuries need urgent attention and sometimes surgery. The first few minutes can make a big difference to the outcome, so it helps to know what to do before you reach us.',
      'If a permanent tooth is knocked out, hold it by the crown (never the root), rinse it gently if dirty, and try to place it back in its socket. If that is not possible, keep it in milk or saliva and get to a dentist within an hour.',
      'For a cracked or displaced tooth, avoid chewing on that side and apply a cold compress to reduce swelling. Take pain relief if needed, but do not place aspirin directly on the gum.',
      'Severe bleeding, breathing difficulty or deep facial lacerations should be treated at the nearest emergency facility. For dental and facial trauma care, contact us as soon as possible so we can stabilise and plan your treatment.',
    ],
  },
  {
    id: '5',
    slug: 'root-canal-myths',
    title: 'Root Canal Myths vs. Facts',
    excerpt:
      'Still afraid of root canals? Let us clear up the biggest misconceptions about this pain-relieving procedure.',
    category: 'Endodontics',
    author: BUSINESS.doctor,
    date: '12 Jan 2026',
    readTime: '5 min read',
    image: SERVICE_IMAGES.rootCanal,
    content: [
      'The biggest myth about root canals is that they are extremely painful. In reality, the procedure is designed to relieve pain, not cause it — modern anaesthesia and techniques make it feel similar to getting a routine filling.',
      'Another common belief is that removing the tooth is a better option. Saving your natural tooth is almost always preferable: it maintains your bite, prevents neighbouring teeth from shifting, and avoids the need for more complex replacements.',
      'Some worry a root canal causes illness elsewhere in the body. Decades of research show no scientific basis for this claim — a root canal removes infection and restores the tooth to full function.',
      'If you have persistent tooth pain, sensitivity to hot or cold, or swelling, do not wait. An early root canal is quicker, more comfortable and far less costly than waiting until the tooth can no longer be saved.',
    ],
  },
  {
    id: '6',
    slug: 'kids-first-dental-visit',
    title: "Your Child's First Dental Visit",
    excerpt:
      'A positive first experience sets the tone for lifelong oral health. Here is how to prepare your child.',
    category: 'Family Care',
    author: BUSINESS.doctor,
    date: '20 Dec 2025',
    readTime: '4 min read',
    image: SERVICE_IMAGES.orthodontics,
    content: [
      'We recommend bringing children for their first visit by their first birthday, or when their first tooth appears. Early visits help children get comfortable with the clinic and allow us to spot problems before they grow.',
      'You can prepare your child by talking about the dentist in a calm, positive way. Avoid threatening language or sharing your own anxieties — children pick up on these cues quickly.',
      'At the first appointment we keep things gentle: a simple examination, counting the teeth and demonstrating good brushing. The goal is familiarity and trust, not a long, invasive procedure.',
      'Between visits, encourage twice-daily brushing with a small, soft brush and a smear of fluoride toothpaste. Limit sugary drinks and snacks, and never put a child to bed with a bottle of anything but water.',
    ],
  },
];

/** Sorted newest-first, used for the "latest posts" list. */
export const getLatestPosts = (BUSINESS: any) => [...getBlogPosts(BUSINESS)].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
