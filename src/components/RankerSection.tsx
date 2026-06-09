import React from 'react';
import { Card } from './ui/card';
import { Shield, DollarSign } from 'lucide-react';

interface RankerCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function RankerCard({ icon, title, description }: RankerCardProps) {
  return (
    <Card className="p-6 bg-card border border-border shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-brand">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
}

export function RankerSection() {
  const rankerFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Соблюдение правил и видимости",
      description: "Ассистент учитывает требования модерации и факторы ранжирования, чтобы объявления чаще попадали в топ."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Экономия бюджета",
      description: "Рекомендации по ставкам и позициям помогают не «лить в пустоту», а получать больше целевых показов."
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-[1100px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="mb-4">Почему важен Avito Ranker 3</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {rankerFeatures.map((feature, index) => (
            <RankerCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}