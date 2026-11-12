import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import localFont from 'next/font/local';
import { Providers } from '@/components/app/providers';
import './globals.css';

// Shriftlar npm paketlaridan — build vaqtida internet kerak emas
const instrumentSerif = localFont({
  src: '../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
  variable: '--font-instrument-serif',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Abu Tolib', template: '%s · Abu Tolib' },
  description:
    "Milliy sertifikat (matematika) uchun diagnostika: qaysi mavzuni qaytarish kerakligini aniq ko'rsatadi.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

// Sahifa chizilishidan oldin mavzuni qo'yadi (oq-qora miltillash bo'lmasin)
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
