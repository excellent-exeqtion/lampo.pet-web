// src/components/lib/steps.tsx
import React from 'react';

interface StepsProps {
  children: React.ReactNode;
  step: number;
  loading: boolean;
  error: string | null;
  onNext: () => void;
  onBack: () => void;
}

export default function Steps({ children, loading, step, error, onNext, onBack }: StepsProps) {

  return (
    <React.Fragment><div className="space-y-4">
      {children}
      {error && (
        <p className="text-error">
          {error}
        </p>
      )}
      <div className="mt-4 flex justify-between">
        {step > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary ml-auto"
            style={{ float: 'left' }}
          >
            Atrás
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="btn-primary"
          style={{ float: 'right' }}
        >
          {loading ? "Creando…" : "Siguiente"}
        </button>
      </div>
    </div>
    </React.Fragment>
  );
}
