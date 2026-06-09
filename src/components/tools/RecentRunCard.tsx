import React from 'react';

export interface RecentRun {
  id: string;
  toolId: string;
  toolName: string;        // «Парсер ниши»
  toolIcon: string;         // «🔍»
  contextLabel: string;     // «ворота гаражные · Москва»
  date: string;             // «28.05 14:02»
  status: 'success' | 'failed' | 'in_progress';
  priceKopecks: number;
  resultUrl?: string;       // /chat/<id> или /tools/run/<id>
}

interface RecentRunCardProps {
  run: RecentRun;
  /** Открыть результат запуска */
  onOpen?: (run: RecentRun) => void;
  /** Перезапустить тот же инструмент */
  onRerun?: (run: RecentRun) => void;
}

const STATUS_LABEL: Record<RecentRun['status'], { label: string; cls: string }> = {
  success:     { label: '✓ Готов',     cls: 'text-emerald-400' },
  failed:      { label: '✕ Ошибка',    cls: 'text-red-400' },
  in_progress: { label: '… Выполняется', cls: 'text-amber-400' },
};

export function RecentRunCard({ run, onOpen, onRerun }: RecentRunCardProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:border-[#9A7FE0]/30 transition cursor-pointer"
      onClick={() => onOpen?.(run)}
    >
      <div className="shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-[rgba(111,66,193,0.15)] text-base">
        {run.toolIcon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">{run.date}</span>
          <span className="text-xs font-semibold text-foreground">{run.toolName}</span>
          <span className={`text-[11px] font-bold ${STATUS_LABEL[run.status].cls}`}>
            {STATUS_LABEL[run.status].label}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate">
          {run.contextLabel}
        </div>
      </div>
      <div className="shrink-0 text-xs font-bold text-foreground">
        {(run.priceKopecks / 100).toLocaleString('ru-RU')} ₽
      </div>
      {onRerun && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRerun(run);
          }}
          className="shrink-0 text-[11px] text-[#9A7FE0] hover:text-[#C5B0F0] transition"
          title="Запустить снова"
        >
          ↻
        </button>
      )}
    </div>
  );
}
