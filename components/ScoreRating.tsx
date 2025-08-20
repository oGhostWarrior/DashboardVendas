// src/components/ScoreRating.tsx

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreRatingProps {
  score: number; // A prop 'score' ainda recebe a nota original de 0-10
}

// A função de cor continua a mesma, baseada na nota original de 0-10
const getScoreColorClass = (score: number) => {
  if (score >= 8) return "text-green-500";
  if (score >= 6) return "text-yellow-500";
  return "text-red-500";
};

export function ScoreRating({ score }: ScoreRatingProps) {
  const colorClass = getScoreColorClass(score);

  // --- LÓGICA DA MUDANÇA ---
  // 1. Mapeia a nota de 0-10 para uma escala de 0-5, arredondando o valor.
  const scoreOutOf5 = Math.round(score / 2);

  return (
    // 2. O title agora mostra ambas as notas para mais clareza.
    <div className="flex items-center gap-2" title={`Score: ${score}/10 (Equivalente a ${scoreOutOf5}/5 estrelas)`}>
      <div className="flex items-center gap-0.5">
        {/* 3. O loop agora renderiza apenas 5 estrelas. */}
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={cn(
              "w-4 h-4",
              // 4. Compara com a nota convertida para 5 estrelas.
              index < scoreOutOf5 ? colorClass : "text-gray-300 dark:text-gray-600"
            )}
            fill="currentColor"
          />
        ))}
      </div>
      {/* Opcional: Mostrar o score original ao lado */}
      <span className={cn("text-sm font-bold", colorClass)}>
        {score}/10
      </span>
    </div>
  );
}