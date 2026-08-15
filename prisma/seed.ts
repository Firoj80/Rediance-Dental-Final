import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  // Create clinic
  const clinic = await db.clinic.create({
    data: {
      name: 'Radiance Dental Care & Facial Trauma Centre',
      tagline: 'Your Smile, Our Passion — Expert Dental Care in Siwan',
      description: 'Radiance Dental Care & Facial Trauma Centre is a premier multi-speciality dental clinic in Siwan, Bihar, offering comprehensive dental and facial trauma care services under the expert guidance of Dr. Shahid Raza.',
      phone: '+91 96573 72836',
      email: 'radiancedentalcare@gmail.com',
      whatsapp: '+919657372836',
      address: 'Infront of Circus Maidan, Fatehpur Bypass Rd, Babhnauli, Siwan, Bihar 841226',
      googleMapsUrl: 'https://www.google.com/maps/place/Siwan,+Bihar+841226',
      instagram: 'https://instagram.com/radiancedentalcare_ftc',
      facebook: 'https://facebook.com/RadianceDentalCare',
      youtube: '',
    },
  })

  // Create clinic settings
  await db.clinicSettings.create({
    data: {
      clinicId: clinic.id,
      doctorName: 'Dr. Shahid Raza',
      doctorQualification: 'BDS (Bachelor of Dental Surgery)',
      doctorExperience: '10+',
      doctorBio: 'Dr. Shahid Raza is a dedicated dental surgeon specializing in comprehensive dental care and facial trauma management. A graduate of Jamia Millia Islamia, Faculty of Dentistry, he brings years of clinical expertise and a patient-first approach to every consultation. His commitment to modern techniques and compassionate care has made Radiance Dental Care a trusted name in Siwan.',
      doctorPhoto: '',
      doctorSpecializations: 'Dental Surgery, Facial Trauma, Root Canal Treatment, Dental Implants, Teeth Whitening, Braces & Orthodontics, Dentures & Prosthodontics',
      defaultSlotDuration: 30,
      bookingAdvanceDays: 30,
      statYears: '10+',
      statPatients: '5,000+',
      statServices: '15+',
      statRating: '4.9',
      homeSeoTitle: 'Radiance Dental Care & Facial Trauma Centre | Best Dentist in Siwan',
      homeSeoDescription: 'Visit Radiance Dental Care & Facial Trauma Centre in Siwan for expert dental treatments including root canal, implants, braces, and facial trauma care by Dr. Shahid Raza.',
      adminPassword: await bcrypt.hash('Siwan@321', 12),
    },
  })

  // Create working hours (Mon-Sat 10:00-18:00, Sun closed)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  for (let i = 0; i < 6; i++) {
    const wh = await db.workingHour.create({
      data: {
        clinicId: clinic.id,
        dayOfWeek: i,
        enabled: true,
      },
    })
    await db.workingSession.create({
      data: {
        workingHourId: wh.id,
        startTime: '10:00',
        endTime: '18:00',
      },
    })
  }
  // Sunday - disabled
  await db.workingHour.create({
    data: {
      clinicId: clinic.id,
      dayOfWeek: 6,
      enabled: false,
    },
  })

  // Create services
  const services = [
    { name: 'Dental Cleaning & Polishing', slug: 'dental-cleaning', shortDescription: 'Professional teeth cleaning to remove plaque and tartar buildup for a healthier, brighter smile.', fullDescription: 'Our professional dental cleaning service goes beyond what regular brushing can achieve. Using advanced ultrasonic scalers and polishing tools, we remove stubborn plaque and tartar deposits that accumulate over time. This procedure helps prevent cavities, gum disease, and bad breath while leaving your teeth feeling smooth and looking their best. We recommend a professional cleaning every six months for optimal oral health.', duration: 30, price: 500, featured: true },
    { name: 'Root Canal Treatment', slug: 'root-canal-treatment', shortDescription: 'Pain-free root canal therapy to save infected or damaged teeth with modern techniques.', fullDescription: 'Root canal treatment (endodontic therapy) is a procedure to save a tooth that is infected, inflamed, or deeply decayed. At Radiance Dental Care, we use advanced rotary instruments and digital imaging to perform root canals with minimal discomfort. The infected pulp is carefully removed, the canals are cleaned and shaped, and then sealed to prevent reinfection. Most patients report that the procedure is no more uncomfortable than getting a filling. With proper care, a root-canal-treated tooth can last a lifetime.', duration: 60, price: 3000, featured: true },
    { name: 'Dental Implants', slug: 'dental-implants', shortDescription: 'Permanent tooth replacement using titanium implants that look, feel, and function like natural teeth.', fullDescription: 'Dental implants are the gold standard for replacing missing teeth. A titanium post is surgically placed into the jawbone, where it fuses with the bone to create a strong, permanent foundation. A custom-made crown is then attached, completing a restoration that looks and functions like a natural tooth. Implants help preserve jawbone structure, prevent adjacent teeth from shifting, and restore your ability to eat and speak comfortably. Our implant procedures are planned using digital imaging for precise placement.', duration: 90, price: 15000, featured: true },
    { name: 'Teeth Whitening', slug: 'teeth-whitening', shortDescription: 'Professional in-office whitening for a brighter, more confident smile in a single visit.', fullDescription: 'Transform your smile with our professional teeth whitening service. Using safe, clinically proven whitening agents, we can lighten your teeth by several shades in just one visit. Unlike over-the-counter products, our in-office treatment is supervised by Dr. Raza to ensure even results and minimal sensitivity. The procedure takes about 60 minutes and the results can last for years with proper maintenance. We also provide custom take-home whitening trays for touch-ups.', duration: 60, price: 4000, featured: true },
    { name: 'Braces & Orthodontics', slug: 'braces-orthodontics', shortDescription: 'Straighten your teeth with modern braces and orthodontic solutions for a perfectly aligned smile.', fullDescription: 'Whether you are a teenager or an adult, it is never too late to achieve a straighter smile. We offer a range of orthodontic options including traditional metal braces, ceramic braces, and clear aligners. During your consultation, Dr. Raza will assess your bite, discuss your goals, and recommend the best treatment plan. Treatment duration typically ranges from 12 to 24 months, with regular follow-up appointments to track progress. Properly aligned teeth are easier to clean and reduce your risk of dental problems.', duration: 30, price: 20000, featured: true },
    { name: 'Dentures & Prosthodontics', slug: 'dentures-prosthodontics', shortDescription: 'Custom-made dentures and dental prosthetics to restore your smile and chewing function.', fullDescription: 'If you are missing multiple teeth, dentures offer an effective and affordable solution to restore your smile and ability to eat comfortably. We provide both full and partial dentures that are custom-crafted to fit your mouth precisely. Using modern materials and techniques, our dentures look natural and feel comfortable. We also offer implant-supported dentures for a more secure fit. Dr. Raza takes detailed impressions and works closely with dental laboratories to ensure the best possible result for each patient.', duration: 45, price: 8000, featured: false },
    { name: 'Tooth Extraction', slug: 'tooth-extraction', shortDescription: 'Safe and gentle tooth removal when a tooth cannot be saved through other treatments.', fullDescription: 'While we always aim to save natural teeth, sometimes extraction is necessary due to severe decay, trauma, infection, or crowding. At Radiance Dental Care, we perform extractions with the utmost care and minimal discomfort. For complex cases such as impacted wisdom teeth, we use advanced imaging to plan the procedure and ensure a smooth recovery. Post-extraction, we provide detailed care instructions and follow-up to promote quick healing.', duration: 30, price: 1000, featured: false },
    { name: 'Gum Treatment', slug: 'gum-treatment', shortDescription: 'Treatment for gum disease to restore healthy gums and prevent tooth loss.', fullDescription: 'Gum disease (periodontal disease) is a common but serious condition that can lead to tooth loss if left untreated. Symptoms include bleeding gums, persistent bad breath, and gum recession. Our gum treatment includes deep cleaning (scaling and root planing), medication, and in some cases, minor surgical procedures. Early-stage gum disease (gingivitis) is often reversible with professional treatment and good oral hygiene. Regular check-ups help catch gum disease early before it causes permanent damage.', duration: 45, price: 2000, featured: false },
    { name: 'Dental Fillings', slug: 'dental-fillings', shortDescription: 'Tooth-colored fillings to restore teeth damaged by cavities while maintaining a natural appearance.', fullDescription: 'Cavities are one of the most common dental problems, but modern filling materials make treatment virtually invisible. We use composite resin fillings that match the color of your natural teeth, providing both strength and aesthetics. The decayed portion of the tooth is carefully removed, the area is cleaned, and the filling material is bonded in place. Tooth-colored fillings are durable, mercury-free, and blend seamlessly with your smile. Regular check-ups help detect cavities early when they are easiest to treat.', duration: 30, price: 800, featured: false },
    { name: 'Facial Trauma Care', slug: 'facial-trauma-care', shortDescription: 'Expert treatment for facial injuries including jaw fractures, soft tissue injuries, and dental trauma.', fullDescription: 'Dr. Shahid Raza has specialized training in managing facial trauma, which includes injuries to the face, jaw, and mouth resulting from accidents, falls, sports injuries, or other causes. Our facial trauma services include treatment for jaw fractures, dental avulsion (knocked-out teeth), soft tissue lacerations, and facial bone injuries. We work with advanced imaging to accurately diagnose the extent of injury and create a comprehensive treatment plan. Early and proper treatment of facial trauma is crucial for optimal healing and restoring both function and appearance.', duration: 60, price: 5000, featured: true },
    { name: 'Children\'s Dentistry', slug: 'childrens-dentistry', shortDescription: 'Gentle dental care for kids in a comfortable and friendly environment.', fullDescription: 'Building positive dental experiences from a young age sets the foundation for a lifetime of good oral health. Our children\'s dentistry services include routine check-ups, cleanings, fluoride treatments, dental sealants, and cavity management. Dr. Raza and our team create a warm, friendly environment to help children feel at ease. We also educate parents and children on proper brushing techniques and nutrition for healthy teeth. We recommend the first dental visit by age one or when the first tooth appears.', duration: 30, price: 400, featured: false },
    { name: 'Dental X-Ray & Diagnostics', slug: 'dental-xray-diagnostics', shortDescription: 'Advanced digital X-rays and diagnostic imaging for accurate treatment planning.', fullDescription: 'Accurate diagnosis is the foundation of effective dental treatment. We use digital X-ray technology that provides high-quality images with significantly less radiation than traditional X-rays. Our diagnostic services include periapical X-rays, bitewing X-rays, panoramic X-rays, and oral examinations. These tools help us detect cavities, bone loss, infections, impacted teeth, and other conditions that may not be visible during a regular examination. Early detection through diagnostics allows for simpler, more effective treatments.', duration: 15, price: 300, featured: false },
  ]

  for (const s of services) {
    await db.service.create({
      data: {
        clinicId: clinic.id,
        ...s,
        displayOrder: services.indexOf(s),
        seoTitle: `${s.name} | ${clinic.name}`,
        seoDescription: s.shortDescription,
      },
    })
  }

  // Create sample testimonials
  const testimonials = [
    { patientName: 'Amit Kumar', review: 'I was very nervous about my root canal, but Dr. Raza made the entire process painless and comfortable. His expertise and gentle approach really put me at ease. The clinic is clean and well-maintained. Highly recommended!', rating: 5 },
    { patientName: 'Priya Singh', review: 'Got my teeth whitening done here and the results are amazing! My teeth are several shades brighter and it looks so natural. Dr. Raza explained everything clearly and the staff is very friendly. Best dental clinic in Siwan!', rating: 5 },
    { patientName: 'Rajesh Verma', review: 'Dr. Shahid Raza is an excellent dentist. He treated my facial injury with great care and skill. The recovery was smooth and I am very satisfied with the results. Thank you, Radiance Dental Care!', rating: 5 },
    { patientName: 'Sneha Kumari', review: 'I got braces from Dr. Raza and I can already see the difference in just a few months. He is very patient and takes time to explain the treatment plan. The clinic environment is very comfortable and the staff is courteous.', rating: 4 },
    { patientName: 'Vikash Sharma', review: 'I had been avoiding the dentist for years, but my experience at Radiance Dental Care changed that. Dr. Raza is thorough yet gentle. He fixed my cavities without any pain. Now I visit regularly for check-ups.', rating: 5 },
    { patientName: 'Neha Gupta', review: 'Very professional dental clinic. Dr. Raza removed my wisdom tooth and it was much easier than I expected. He gave clear post-operative instructions and followed up the next day. Great care!', rating: 5 },
  ]

  for (let i = 0; i < testimonials.length; i++) {
    await db.testimonial.create({
      data: {
        clinicId: clinic.id,
        ...testimonials[i],
        displayOrder: i,
      },
    })
  }

  // Create sample blog posts
  const blogs = [
    {
      title: '5 Things to Know Before Your Root Canal Treatment',
      slug: '5-things-to-know-before-root-canal',
      content: `Root canal treatment often sounds intimidating, but modern dentistry has made it a routine and comfortable procedure. Here are five important things you should know before your appointment.

## 1. Root Canals Are Not Painful

One of the biggest myths about root canals is that they are extremely painful. In reality, the procedure is performed under local anesthesia, making it no more uncomfortable than getting a filling. Most patients report significant relief after the treatment because it eliminates the pain caused by the infected tooth.

## 2. It Saves Your Natural Tooth

The primary goal of a root canal is to save your natural tooth. Without treatment, an infected tooth would need to be extracted, which can lead to other dental problems. Preserving your natural tooth maintains your chewing ability and keeps your other teeth properly aligned.

## 3. The Procedure Is Straightforward

During a root canal, Dr. Raza will:
1. Numb the area completely
2. Create a small opening in the tooth
3. Remove the infected pulp
4. Clean and shape the root canals
5. Fill and seal the canals
6. Place a crown for protection

The entire process typically takes 60 to 90 minutes.

## 4. Recovery Is Quick

Most patients return to their normal activities within a day or two. You may experience mild soreness for a few days, which can be managed with over-the-counter pain relievers. Dr. Raza will provide specific aftercare instructions.

## 5. Prevention Is Better Than Cure

Regular dental check-ups and good oral hygiene can help prevent the need for root canals. Brush twice daily, floss regularly, and visit your dentist every six months for professional cleaning and examination.

If you are experiencing tooth pain or sensitivity, do not wait. Early treatment leads to better outcomes. Contact Radiance Dental Care to schedule a consultation with Dr. Shahid Raza.`,
      category: 'Dental Health',
      tags: 'root canal, dental health, tooth pain, endodontics',
      published: true,
      publishedAt: new Date('2025-01-15'),
    },
    {
      title: 'Why Regular Dental Check-ups Matter',
      slug: 'why-regular-dental-checkups-matter',
      content: `Many people only visit the dentist when they have a problem, but regular check-ups are essential for maintaining good oral health and catching issues early.

## Early Detection Saves Teeth

Many dental problems, including cavities, gum disease, and even oral cancer, develop silently without obvious symptoms in the early stages. Regular check-ups allow Dr. Raza to detect and treat these issues before they become serious and expensive to fix.

## Professional Cleaning Is Essential

Even with excellent brushing and flossing habits, plaque and tartar can build up in areas that are difficult to reach. Professional cleaning removes these deposits, reducing your risk of cavities and gum disease.

## How Often Should You Visit?

The general recommendation is to visit your dentist every six months. However, some people may need more frequent visits depending on their oral health status, risk factors, and ongoing treatments.

## What Happens During a Check-up?

- **Examination:** Dr. Raza examines your teeth, gums, and mouth for any signs of problems
- **X-rays:** Digital X-rays may be taken to detect hidden issues
- **Cleaning:** Professional cleaning to remove plaque and tartar
- **Discussion:** Personalized advice on improving your oral care routine

## The Connection Between Oral and Overall Health

Research has shown strong links between oral health and overall health. Poor oral health has been associated with heart disease, diabetes, respiratory infections, and other systemic conditions. Taking care of your teeth is an investment in your overall well-being.

Book your next check-up at Radiance Dental Care today!`,
      category: 'Dental Health',
      tags: 'check-up, dental health, prevention, oral hygiene',
      published: true,
      publishedAt: new Date('2025-02-10'),
    },
    {
      title: 'A Complete Guide to Dental Implants',
      slug: 'complete-guide-to-dental-implants',
      content: `Dental implants are considered the gold standard for replacing missing teeth. If you are considering implants, here is everything you need to know.

## What Are Dental Implants?

A dental implant consists of three parts:
1. **The Implant Post:** A titanium screw placed into the jawbone
2. **The Abutment:** A connector that attaches to the implant post
3. **The Crown:** The visible part that looks like a natural tooth

## Benefits of Dental Implants

- **Permanent solution** — unlike dentures, implants do not need to be removed
- **Natural appearance** — custom crowns match your existing teeth
- **Preserves jawbone** — prevents bone loss that occurs with missing teeth
- **No diet restrictions** — eat all your favorite foods confidently
- **Improves speech** — unlike loose dentures that can slip

## Am I a Candidate?

Most adults with good general health are candidates for dental implants. Factors that Dr. Raza will evaluate include:
- Bone density and quality in the implant area
- Overall health and any medical conditions
- Gum health
- Commitment to oral hygiene

## The Implant Process

The process typically takes 3 to 6 months and involves:
1. **Consultation and Planning** — Examination, X-rays, and treatment plan
2. **Implant Placement** — The titanium post is placed into the jawbone
3. **Healing Period** — 3 to 6 months for the implant to fuse with the bone
4. **Abutment and Crown** — The final restoration is placed

With proper care, dental implants can last a lifetime. Contact Radiance Dental Care to learn more about whether implants are right for you.`,
      category: 'Treatments',
      tags: 'dental implants, tooth replacement, missing teeth, oral surgery',
      published: true,
      publishedAt: new Date('2025-03-05'),
    },
  ]

  for (const blog of blogs) {
    await db.blogPost.create({
      data: {
        clinicId: clinic.id,
        author: 'Dr. Shahid Raza',
        ...blog,
        seoTitle: `${blog.title} | ${clinic.name}`,
        seoDescription: blog.content.substring(0, 160),
      },
    })
  }

  console.log('✅ Seed data created successfully!')
  console.log(`   Clinic: ${clinic.name}`)
  console.log(`   Services: ${services.length}`)
  console.log(`   Testimonials: ${testimonials.length}`)
  console.log(`   Blog Posts: ${blogs.length}`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
