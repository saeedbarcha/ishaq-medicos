import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { WhatsAppFloat } from '@/components/common/WhatsAppFloat';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function SiteLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-mist">
      <Header />
      <motion.main
        key={location.pathname}
        className="flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<div className="px-4 py-16 text-center text-ink/60">Loading…</div>}>
          <Outlet />
        </Suspense>
      </motion.main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
