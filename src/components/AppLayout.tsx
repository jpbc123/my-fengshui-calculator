import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from '@/lib/helmet-shim';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ScrollToTop from '@/components/ScrollToTop';
import Footer from '@/components/Footer';
import PageTitleManager from '@/components/PageTitleManager';

const queryClient = new QueryClient();

const AppLayout = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <PageTitleManager>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </PageTitleManager>
    </TooltipProvider>
    <Analytics />
  </QueryClientProvider>
  </HelmetProvider>
);

export default AppLayout;
