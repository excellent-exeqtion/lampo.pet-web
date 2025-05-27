// src/utils/steps.ts
import { StepsStateType, StepStateEnum } from '@/types/lib';
import { Dispatch } from 'react';

export function ChangeState(stepStates: StepsStateType[], setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>, stepNumber: number, stepState: StepStateEnum, stepError: string | null = null) {
    const step = stepStates.find(s => s.step == stepNumber);
    if (step) {
        step.state = stepState;
        step.error = stepError;
    }
    setStepStates(stepStates);
}