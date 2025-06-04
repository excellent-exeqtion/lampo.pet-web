import { getFetch } from "@/app/api";
import { useRoleContext } from "@/context/RoleProvider";
import { useSessionContext } from "@/context/SessionProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { ApiError } from "@/types/lib";
import { useState, useEffect } from "react";
import { SubscriptionType } from "@/types/index";
import { Empty } from "../data";

export function useSelectedPlan(): {
    isLoading: boolean;
    hasSelectedPlan: boolean;
    hasFreePlan: boolean;
    hasStandardPlan: boolean;
    hasAdvancedPlan: boolean;
    hasLifetimePlan: boolean;
    requiresPlan: boolean;
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
    const [requiresPlan, setRequiresPlan] = useState(false);

    const requestSubscription = async () => {
        const ownerId = session?.user?.id;
        const response = await getFetch(`/api/plans/subscriptions/${ownerId}`);
        if (!response.ok) throw new ApiError(`Fallo al obtener la suscripción actual del dueño: ${ownerId}`);
        const { data } = await response.json();
        let subscription = Empty.Subscription();
        subscription.id = -1;
        let hasSelectedPlan = false;
        if (data) {
            hasSelectedPlan = true;
            subscription = data as SubscriptionType;
        }
        storage.setStoredSubscriptionData(subscription);
        setStates(hasSelectedPlan, subscription);
    }

    useEffect(() => {
        const ownerId = session?.user?.id;
        if (!session || !ownerId) return;

        (async () => {
            if (!isOwner) {
                setStates(true, Empty.Subscription());
            }
            else {
                if (!storage.storedSubscriptionData?.id) {
                    await requestSubscription();
                }
                else {
                    setStates(true, storage.storedSubscriptionData);
                }
            }
            setLoadingPlan(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id, storage.storedSubscriptionData]);

    const setStates = (hasSelectedPlan: boolean, subscription: SubscriptionType) => {
        if (!isOwner) {
            setHasSelectedPlan(true);
            setHasLifetimePlan(false);
            setHasAdvancedPlan(false);
            setHasStandardPlan(false);
            setHasFreePlan(false);
            setRequiresPlan(false);
            return;
        }
        if (!hasSelectedPlan || subscription.id == -1) {
            setHasSelectedPlan(false);
            setHasLifetimePlan(false);
            setHasAdvancedPlan(false);
            setHasStandardPlan(false);
            setHasFreePlan(false);
            setRequiresPlan(true);
            return;
        }
        switch (subscription.plans_versions.plans.slug) {
            case 'lifetime': {
                setHasSelectedPlan(true);
                setHasLifetimePlan(true);
                setHasAdvancedPlan(false);
                setHasStandardPlan(false);
                setHasFreePlan(false);
                setRequiresPlan(true);
            }
            case 'advanced': {
                setHasSelectedPlan(true);
                setHasLifetimePlan(false);
                setHasAdvancedPlan(true);
                setHasStandardPlan(false);
                setHasFreePlan(false);
                setRequiresPlan(true);
            }
            case 'standard': {
                setHasSelectedPlan(true);
                setHasLifetimePlan(false);
                setHasAdvancedPlan(false);
                setHasStandardPlan(true);
                setHasFreePlan(false);
                setRequiresPlan(true);
            }
            default:
            case 'free': {
                setHasSelectedPlan(true);
                setHasLifetimePlan(false);
                setHasAdvancedPlan(false);
                setHasStandardPlan(false);
                setHasFreePlan(true);
                setRequiresPlan(true);
            }
        }
    }

    return {
        isLoading: loadingPlan,
        hasSelectedPlan,
        hasFreePlan,
        hasStandardPlan,
        hasAdvancedPlan,
        hasLifetimePlan,
        requiresPlan
    };
}
