import React from 'react';

interface BillingSwitcherProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
  disableYearly?: boolean;
}

export function BillingSwitcher({ isYearly, onToggle, disableYearly = false }: BillingSwitcherProps) {
  return (
    <div className="inline-flex items-center bg-[#0F1422] border border-border rounded-full p-1">
      <button
        onClick={() => onToggle(false)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
          !isYearly
            ? 'bg-[#0F1422] text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Ежемесячно
      </button>
      <button
        onClick={() => onToggle(true)}
        disabled={disableYearly}
        title={disableYearly ? 'Годовая оплата будет доступна позже' : undefined}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
          isYearly
            ? 'bg-[#0F1422] text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        } ${disableYearly ? 'opacity-50 cursor-not-allowed hover:text-muted-foreground' : ''}`}
      >
        Ежегодно (−15%)
      </button>
    </div>
  );
}
