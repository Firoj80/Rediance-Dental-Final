import './globals.css';

export const metadata = {
  title: 'Radiance Dental Care & Facial Trauma Centre | Siwan, Bihar',
  description: 'Professional dental care and facial trauma services by Dr. Shahid Raza in Siwan, Bihar. Book your appointment today.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
