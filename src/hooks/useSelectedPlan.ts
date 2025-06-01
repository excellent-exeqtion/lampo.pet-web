import { getFetch } from "@/app/api";
import { useRoleContext } from "@/context/RoleProvider";
import { useSessionContext } from "@/context/SessionProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { ApiError } from "@/types/lib";
import { useState, useEffect } from "react";
import { PlanType } from "../types";

export function useSelectedPlan(): {
    isLoading: boolean;
    hasSelectedPlan: boolean;
    hasFreePlan: boolean;
    hasStandardPlan: boolean;
    hasAdvancedPlan: boolean;
    hasLifetimePlan: boolean;
    doesNotRequiresPlan: boolean;
} {
    const { db: session } = useSessionContext();
    const storage = useStorageContext();
    const { isOwner } = useRoleContext();

    const [loadingPlan, setLoadingPlan] = useState(true);
    const [hasSelectedPlan, setHasSelectedPlan] = useState(false);
    const [hasFreePlan, setHasFreePlan] = useState(false);
    const [hasStandardPlan, setHasStandardPlan] = useState(false);
    const [hasAdvancedPlan, setHasAdvancedPlan] = useState(false);
    const [hasLifetimePlan, setHasLifetimePlan] = useState(false);
    const [doesNotRequiresPlan, setDoesNotRequiresPlan] = useState(false);

    useEffect(() => {
        const ownerId = session?.user?.id;
        if (!session || !ownerId) return;

        (async () => {
            if (isOwner) {
                if (!storage.storedPlanData) {
                    const response = await getFetch(`/api/plans/subscriptions/${ownerId}`);
                    if (!response.ok) throw new ApiError(`Fallo al obtener la suscripción actual del dueño: ${ownerId}`);
                    const data = await response.json();
                    if (data == null) {
                        setHasSelectedPlan(false);
                    }
                    storage.setStoredPlanData(data as PlanType);
                }
            }
            setLoadingPlan(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, session?.user?.id]);

    useEffect(() => {
        if (hasSelectedPlan) {
            if (storage.storedPlanData) {
                switch (storage.storedPlanData.slug) {
                    case 'lifetime': {
                        setHasLifetimePlan(true);
                    }
                    case 'advanced': {
                        setHasAdvancedPlan(true);
                    }
                    case 'standard': {
                        setHasStandardPlan(true);
                    }
                    default:
                    case 'free': {
                        setHasFreePlan(true);
                    }
                }
            }
            else {
                setDoesNotRequiresPlan(true);
            }
        }
        else {
            setHasLifetimePlan(false);
            setHasAdvancedPlan(false);
            setHasStandardPlan(false);
            setHasFreePlan(false);
            setDoesNotRequiresPlan(false);
        }
    }, [storage.storedPlanData, hasSelectedPlan])

    return {
        isLoading: loadingPlan,
        hasSelectedPlan,
        hasFreePlan,
        hasStandardPlan,
        hasAdvancedPlan,
        hasLifetimePlan,
        doesNotRequiresPlan
    };

}
