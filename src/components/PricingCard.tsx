import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  monthlyPrice: string;
  /** "Подходит, если вы" — список пунктов */
  features: string[];
  /** Например: "Для 1–3 проектов в работе" */
  workloadLine?: string;
  /** Например: "100 запросов ассистента" */
  requestsLine?: string;
  /** Например: "Подходит, если вы:" */
  fitsTitle?: string;
  isPopular?: boolean;
  onSelect: () => void;
}

export function PricingCard({
  title,
  monthlyPrice,
  features,
  workloadLine,
  requestsLine,
  fitsTitle,
  isPopular = false,
  onSelect,
}: PricingCardProps) {
  return (
    <Card className={`bg-card border-border shadow-card relative h-full ${isPopular ? 'ring-2 ring-brand' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="!bg-[#6F42C1] !text-white px-4 py-1">
          Популярный
          </Badge>
        </div>
      )}

      <div className="p-8 space-y-6 h-full flex flex-col">
        {/* Header */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>

          {workloadLine ? (
            <div className="text-sm text-muted-foreground">{workloadLine}</div>
          ) : null}
          {requestsLine ? (
            <div className="text-sm font-medium text-foreground/90">{requestsLine}</div>
          ) : null}

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground">{monthlyPrice}</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 flex-grow">
          {fitsTitle ? <div className="text-sm font-medium text-foreground/80">{fitsTitle}</div> : null}

          <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
          </ul>
        </div>


        {/* CTA Button */}
        <Button
          className={`w-full rounded-full ${
            isPopular
              ? 'hero-cta-primary'
              : 'bg-card border border-border text-foreground hover:!bg-[rgba(154,127,224,0.12)] hover:!border-[rgba(154,127,224,0.28)] active:!bg-[rgba(154,127,224,0.16)]'
          }`}
          variant={isPopular ? 'default' : 'outline'}
          onClick={onSelect}
        >
          Выбрать
        </Button>
      </div>
    </Card>
  );
}
