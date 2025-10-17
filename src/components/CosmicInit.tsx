'use client';

import { useEffect } from 'react';

export default function CosmicInit() {
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod: any = await import('cosmic-ui');
        if (!mounted) return;
        if (typeof mod.setConfig === 'function') {
          mod.setConfig({
            spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32 },
          });
        }
      } catch {
        // ignore if unavailable
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return null;
}


