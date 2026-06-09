import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, Crown, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function FlowDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: 'Free чат',
      description: 'Пользователь в бесплатной версии',
      features: ['Кнопка "Переключиться на PRO"', 'Ограничения в тултипах', 'Базовый функционал'],
      action: 'Нажать "Переключиться на PRO"'
    },
    {
      title: 'Страница тарифов',
      description: 'Выбор подходящего плана',
      features: ['Три тарифных плана', 'Переключатель "Ежемесячно/Ежегодно"', 'Скидка 15% при годовой оплате'],
      action: 'Выбрать тариф'
    },
    {
      title: 'PRO чат',
      description: 'Полный доступ к PRO функциям',
      features: ['Бейдж PRO в шапке', 'Нет кнопки "Переключиться на PRO"', '"Лимитов хватает" вместо ограничений'],
      action: 'Пользоваться PRO функциями'
    }
  ];
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const resetFlow = () => {
    setCurrentStep(0);
  };
  
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <Card className="max-w-4xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-4">Flow Demo: Free → PRO</h1>
          <p className="text-muted-foreground">
            Демонстрация перехода пользователя из бесплатной версии в PRO
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep 
                    ? 'bg-brand text-white' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-2
                    ${index < currentStep ? 'bg-brand' : 'bg-muted'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Шаг {currentStep + 1} из {steps.length}
          </div>
        </div>
        
        {/* Current step content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              {currentStep === 0 && <Zap className="w-5 h-5 text-muted-foreground" />}
              {currentStep === 1 && <ArrowRight className="w-5 h-5 text-brand" />}
              {currentStep === 2 && <Crown className="w-5 h-5 text-brand" />}
              <h2 className="text-2xl font-semibold">{steps[currentStep].title}</h2>
              {currentStep === 2 && (
                <Badge className="bg-gradient-to-r from-brand to-accent text-primary-foreground border-0 gap-1">
                  <Crown className="w-3 h-3" />
                  PRO
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          
          <div className="grid gap-3 mb-6">
            {steps[currentStep].features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <strong>Действие:</strong> {steps[currentStep].action}
          </div>
        </motion.div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Назад
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" onClick={resetFlow}>
              Сбросить
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Далее
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={resetFlow} variant="default">
                Начать заново
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Key differences summary */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">Ключевые отличия PRO версии:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-destructive">Free версия:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Кнопка "Переключиться на PRO"</li>
                <li>• Ограничительные тултипы</li>
                <li>• Медленные ответы (5 сек)</li>
                <li>• Больше ошибок (20%)</li>
                <li>• Лимит файлов: 20MB, 3 файла</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-accent">PRO версия:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Бейдж PRO в шапке</li>
                <li>• "Лимитов хватает" индикатор</li>
                <li>• Быстрые ответы (3 сек)</li>
                <li>• Меньше ошибок (5%)</li>
                <li>• Лимит файлов: 50MB, 10 файлов</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}