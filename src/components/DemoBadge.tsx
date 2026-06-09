import React, { useState } from 'react';
import { isDemoMode } from '../lib/demoMode';

export function DemoBadge() {
  const [show, setShow] = useState(true);
  if (!isDemoMode() || !show) return null;
  return (
    <div
      className="fixed bottom-3 left-3 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6F42C1]/20 border border-[#6F42C1]/40 backdrop-blur-md text-xs font-medium text-[#C5B0F0] cursor-pointer hover:bg-[#6F42C1]/30 transition"
      onClick={() => {
        if (confirm('Демо-режим выключить? Страница перезагрузится с реальным бэком (?demo=0).')) {
          window.location.href = window.location.pathname + '?demo=0';
        }
      }}
      title="Это макет без реального бэкенда. Клик для отключения."
    >
      🎨 Демо-режим
    </div>
  );
}
