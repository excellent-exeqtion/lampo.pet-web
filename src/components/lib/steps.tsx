// src/components/lib/steps.tsx
import React from 'react';

interface StepsProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  submitLoading: boolean;
  loadLoading: boolean;
  error: string | null;
  onNext: () => void;
  onBack: () => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function StepsComponent({ children, submitLoading, loadLoading, step, totalSteps, error, onNext, onBack/*, setShowModal*/ }: StepsProps) {

  return (
    <>
      <div className="space-y-4">
        <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '1rem', marginBottom: '1rem' }}>
          {children}
        </div>
        {error && (
          <p style={{ color: "var(--primary-red)" }}>
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
            disabled={submitLoading || loadLoading}
            className="btn-primary"
            style={{ float: 'right' }}
          >
            {submitLoading ? "Guardando…" : (totalSteps - 1 == step ? "Finalizar" : "Siguiente")}
          </button>
        </div>
      </div>
    </>
  );
}
