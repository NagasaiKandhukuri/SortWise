import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AppHeader } from '@/components/layout/app-header'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'SortWise - Visualize Sorting Algorithms',
  description: 'An educational website to learn, visualize, and compare sorting algorithms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex min-h-screen w-full flex-col">
                <AppHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
                </main>
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
