// app/components/AnalyticsProvider.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pageview',
          path: pathname,
        }),
      }).catch(() => {
        // Silently fail - don't block user experience
      });
    }
  }, [pathname]);

  return <>{children}</>;
}