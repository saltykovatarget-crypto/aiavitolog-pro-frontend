import { useEffect, useMemo } from 'react';

declare const __BUILD_TIMESTAMP__: string;

// Vite injects `import.meta.env.PROD === true` for `vite build` output.
// We keep the build chip and the console log strictly in non-production so
// production users don't see a git fingerprint in the DOM or DevTools.
const IS_PROD = import.meta.env.PROD;

const getShortSha = () => {
  const sha = import.meta.env.VITE_GIT_SHA;
  if (!sha) return null;
  return sha.length > 8 ? sha.slice(0, 8) : sha;
};

export function BuildMarker() {
  const meta = useMemo(() => {
    const sha = getShortSha();
    return {
      sha,
      mode: import.meta.env.MODE,
      timestamp: __BUILD_TIMESTAMP__,
    };
  }, []);

  useEffect(() => {
    if (IS_PROD) return;
    // eslint-disable-next-line no-console
    console.info('[BUILD]', meta);
  }, [meta]);

  if (IS_PROD) return null;

  const label = meta.sha ? `build ${meta.sha}` : `build ${meta.mode}`;

  return (
    <div className="pointer-events-none fixed bottom-2 right-2 z-[9999] rounded bg-black/70 px-2 py-1 text-[10px] text-white/90 shadow">
      {label} • {meta.timestamp}
    </div>
  );
}
