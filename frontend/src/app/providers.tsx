import { Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';
import { router } from '@/app/router';
import { persistor, store } from '@/store/store';

export function AppProviders() {
  return (
    <MotionConfig reducedMotion="user">
    <Provider store={store}>
      <PersistGate
        loading={<div className="px-4 py-16 text-center text-ink/60">Loading Ishaq Medical…</div>}
        persistor={persistor}
      >
        <HelmetProvider>
          <Suspense fallback={<div className="px-4 py-16 text-center text-ink/60">Loading…</div>}>
            <RouterProvider router={router} />
          </Suspense>
          <Toaster position="top-center" richColors />
        </HelmetProvider>
      </PersistGate>
    </Provider>
    </MotionConfig>
  );
}
