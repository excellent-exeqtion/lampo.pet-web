import { StepsStateType, StepStateEnum } from '@/types/lib';
import { Dispatch } from 'react';

export function ChangeState(stepStates: StepsStateType[], setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>, stepNumber: number, stepState: StepStateEnum, stepError: string | null = null) {
    const step = stepStates.find(s => s.number == stepNumber);
    if (step) {
        step.state = stepState;
        step.error = stepError;
    }
    else {
        stepStates.push({ number: stepNumber, state: stepState, error: stepError });
    }
    setStepStates(stepStates);
}