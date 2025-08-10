import "./globals.css";
import { Space_Mono, Roboto_Mono } from 'next/font/google';
import { ConditionalHeader, Footer } from '@/components';
import { TransitionProvider } from '@/components/ui';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

const robotoMono = Roboto_Mono({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata = { title: "RoomSplit" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`antialiased ${spaceMono.variable} ${robotoMono.variable}`}>
      <body 
        className="bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-neutral-950 dark:to-slate-900 font-mono"
        style={{
          backgroundImage: `
            linear-gradient(to right, #80808012 1px, transparent 1px),
            linear-gradient(to bottom, #80808012 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      >
        <TransitionProvider>
          <ConditionalHeader />
          <main className="relative mx-auto max-w-7xl px-4 lg:px-8 py-8">{children}</main>
          <Footer />
        </TransitionProvider>
      </body>
    </html>
  );
}
