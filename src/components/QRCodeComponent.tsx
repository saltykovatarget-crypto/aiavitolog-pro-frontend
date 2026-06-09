import React from 'react';
import { Smartphone } from 'lucide-react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeComponent({ value, size = 160, className = '' }: QRCodeComponentProps) {
  // For demo purposes, we'll create a visual QR-like pattern
  // In a real app, you'd use a QR code library like 'qrcode' or 'react-qr-code'
  
  const generatePattern = (data: string) => {
    // Simple pseudo-random pattern based on the data string
    const seed = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (index: number) => ((seed + index) * 9301 + 49297) % 233280 / 233280;
    
    const gridSize = 21; // Standard QR code size
    const pattern = [];
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      pattern.push(random(i) > 0.5);
    }
    
    return pattern;
  };

  const pattern = generatePattern(value);
  const gridSize = 21;
  const moduleSize = size / gridSize;

  return (
    <div className={`relative ${className}`}>
      <div 
        className="bg-white p-4 rounded-xl shadow-sm border"
        style={{ width: size + 32, height: size + 32 }}
      >
        {/* QR Code pattern */}
        <div 
          className="relative bg-black"
          style={{ width: size, height: size }}
        >
          {pattern.map((filled, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            
            // Add finder patterns (corners)
            const isFinderPattern = 
              (row < 7 && col < 7) || 
              (row < 7 && col >= gridSize - 7) || 
              (row >= gridSize - 7 && col < 7);
            
            const isFinderCenter = 
              (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
              (row >= 2 && row <= 4 && col >= gridSize - 5 && col <= gridSize - 3) ||
              (row >= gridSize - 5 && row <= gridSize - 3 && col >= 2 && col <= 4);
            
            let bgColor = 'bg-white';
            if (isFinderPattern) {
              bgColor = (row === 0 || row === 6 || col === 0 || col === 6 || 
                        row === gridSize - 1 || row === gridSize - 7 || 
                        col === gridSize - 1 || col === gridSize - 7) ? 'bg-black' : 'bg-white';
            } else if (isFinderCenter) {
              bgColor = 'bg-black';
            } else if (filled) {
              bgColor = 'bg-black';
            }
            
            return (
              <div
                key={index}
                className={bgColor}
                style={{
                  position: 'absolute',
                  left: col * moduleSize,
                  top: row * moduleSize,
                  width: moduleSize,
                  height: moduleSize,
                }}
              />
            );
          })}
        </div>
        
        {/* Center logo overlay */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-2 shadow-sm"
          style={{ width: size * 0.2, height: size * 0.2 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-brand to-accent rounded flex items-center justify-center">
            <Smartphone className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
      
      {/* Caption */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        QR-код для регистрации
      </p>
    </div>
  );
}