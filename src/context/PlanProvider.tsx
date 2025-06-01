// src/context/PlanProvider.tsx
"use client";
import React, { createContext, useContext } from "react";
import { useSelectedPlan } from "@/hooks/useSelectedPlan";

interface PlanContextType {
    isLoading: boolean;
    hasSelectedPlan: boolean;
    hasFreePlan: boolean;
    hasStandardPlan: boolean;
    hasAdvancedPlan: boolean;
    hasLifetimePlan: boolean;
    doesNotRequiresPlan: boolean;
}

const PlanContext = createContext<PlanContextType>({
    isLoading: true,
    hasSelectedPlan: true,
    hasFreePlan: true,
    hasStandardPlan: false,
    hasAdvancedPlan: false,
    hasLifetimePlan: false,
    doesNotRequiresPlan: false,
});

export const usePlanContext = () => useContext(PlanContext);

export function PlanProvider({ children }: { children: React.ReactNode }) {
    const {
        isLoading,
        hasSelectedPlan,
        hasFreePlan,
        hasStandardPlan,
        hasAdvancedPlan,
        hasLifetimePlan,
        doesNotRequiresPlan } = useSelectedPlan();
    return (
        <PlanContext.Provider value={{
            isLoading,
            hasSelectedPlan,
            hasFreePlan,
            hasStandardPlan,
            hasAdvancedPlan,
            hasLifetimePlan,
            doesNotRequiresPlan
        }}>
            {children}
        </PlanContext.Provider>
    );
}