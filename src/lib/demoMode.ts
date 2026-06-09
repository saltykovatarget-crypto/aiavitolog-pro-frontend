const KEY = 'demoMode';
type DemoState = 'on' | 'off' | 'auto-on' | null;

export function getDemoState(): DemoState {
  try {
    return (localStorage.getItem(KEY) as DemoState) ?? null;
  } catch {
    return null;
  }
}

export function setDemoState(value: DemoState): void {
  try {
    if (value === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, value);
  } catch {}
}

export function isDemoMode(): boolean {
  const v = getDemoState();
  return v === 'on' || v === 'auto-on';
}

export function initDemoModeFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    const p = url.searchParams.get('demo');
    if (p === '0') setDemoState('off');
    else if (p === '1') setDemoState('on');
    if (p !== null) {
      url.searchParams.delete('demo');
      window.history.replaceState({}, '', url.toString());
    }
  } catch {}
}

export function tryAutoEnableDemoMode(reason: string): void {
  if (getDemoState() === 'off') return;
  setDemoState('auto-on');
  console.warn('[Demo Mode] auto-enabled, reason:', reason);
}
