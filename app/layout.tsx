import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalNavbar from './components/ConditionalNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Anonymous Mic',
  description: 'Share anonymous messages with featured individuals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 min-h-screen w-full h-full flex flex-col items-center`}>
        <ConditionalNavbar />
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}