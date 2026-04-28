import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cyber Evidence Locker',
  description: 'A digital forensic integrity verification system powered by Whirlpool cryptographic hashing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex`}>
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen relative overflow-y-auto">
          {/* Subtle cyber background grid is handled in globals.css, we just need a dark overlay */}
          <div className="absolute inset-0 bg-black/40 -z-10" />
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
