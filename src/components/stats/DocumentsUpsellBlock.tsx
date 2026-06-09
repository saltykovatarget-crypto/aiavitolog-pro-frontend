import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowRight } from 'lucide-react';

interface DocumentsUpsellBlockProps {
  onGoToPricing?: () => void;
  title?: string;
}

export function DocumentsUpsellBlock({ onGoToPricing, title = 'Мои документы' }: DocumentsUpsellBlockProps) {
  const handleNavigate = () => {
    try {
      if (onGoToPricing) {
        onGoToPricing();
      } else {
        window.location.hash = 'pricing';
      }
    } catch (error) {
      console.error('Failed to navigate to pricing', error);
    }
  };

  return (
    <Card className="bg-card border border-border shadow-card p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            Анализ файлов доступен на тарифах Профессиональный и Агентский.
          </p>
        </div>
        <Button onClick={handleNavigate} className="gap-2 self-start md:self-auto">
          Перейти к тарифам
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
