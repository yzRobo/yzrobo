// app/hooks/useAnalytics.ts
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTracking() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Track page view
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
  }, [pathname]);
}

export function useContentTracking(
  contentType: 'recipe' | 'project' | 'vehicle-post',
  contentId: string,
  slug: string
) {
  useEffect(() => {
    if (!contentId || !slug) return;
    
    // Track content view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'content',
        contentType,
        contentId,
        slug,
      }),
    }).catch(() => {
      // Silently fail
    });
  }, [contentType, contentId, slug]);
}