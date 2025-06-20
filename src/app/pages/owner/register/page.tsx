// app/pages/owner/register/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { PlanVersionType, SubscriptionType } from "@/types/index";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { getFetch, postFetch } from "@/app/api";
import { useSessionContext } from "@/context/SessionProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { Currency } from "@/utils/index";

export default function RegisterPage() {
    useSession();
    const router = useRouter();
    const [plans, setPlans] = useState<PlanVersionType[]>([]);
    const [cycles, setCycles] = useState<Record<string, "monthly" | "annual">>(
        {}
    );
    const [loading, setLoading] = useState<boolean>(false);
    const session = useSessionContext();
    const { setStoredSubscriptionData } = useStorageContext();

    useEffect(() => {
        async function load() {
            try {
                const response = await getFetch("/api/plans/current");
                const json = await response.json();
                if (json.success) {
                    const data = json.plans;
                    setPlans(data);

                    const initialCycles: Record<string, "monthly" | "annual"> = {};
                    data.forEach((p: PlanVersionType) => {
                        initialCycles[p.id.toString()] = "monthly";
                    });
                    setCycles(initialCycles);
                } else {
                    console.error("Error obteniendo planes:", json.message);
                }
            } catch (err) {
                console.error("Error en petición de planes:", err);
            }
        }
        load();
    }, []);

    // Validar sesión
    if (!session?.db?.user?.id) {
        console.error("No hay sesión activa o falta el user.id");
        return null;
    }

    const ownerId = session?.db?.user?.id;

    const handleCycle = (planId: string, cycle: "monthly" | "annual") => {
        setCycles((prev) => ({ ...prev, [planId]: cycle }));
    };

    const handleSelect = async (plan: PlanVersionType) => {
        setLoading(true);
        try {
            const cycle = cycles[plan.id.toString()];
            const priceAtPurchase = cycle === "annual" ? plan.price_year : plan.price_month;
            const discountApplied = cycle === "annual" ? plan.discount_year : plan.discount_month;

            const response = await postFetch("/api/plans/subscriptions", undefined, {
                ownerId,
                planVersionId: plan.id.toString(),
                cycle,
                priceAtPurchase,
                discountApplied
            });
            const json = await response.json();

            if (!response.ok || !json.success) {
                throw new Error(json.message || "Error al crear suscripción");
            }
            setStoredSubscriptionData(json.subscription as SubscriptionType);

            router.replace("/pages/home");
        } catch (e) {
            console.error("Error creando suscripción:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ padding: "2rem", background: "var(--primary-inverse)" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1.5rem",
                }}
            >
                {plans.map((plan) => {
                    const key = plan.id.toString();
                    const cycle = cycles[key] || "monthly";
                    const isStandard = plan.slug === "standard";
                    const borderColor = "var(--pico-primary)";
                    const darkBg = isStandard;
                    const cardStyle: React.CSSProperties = darkBg
                        ? { background: "var(--primary-darkblue)", color: "var(--primary-inverse)", borderRadius: "8px" }
                        : { border: `2px solid ${borderColor}`, background: "var(--primary-inverse)", borderRadius: "8px" };

                    const discountMonthlyLabel =
                        plan.discount_month > 0 ? `${plan.discount_month}% Descuento` : undefined;
                    const discountYearLabel =
                        plan.discount_year > 0 ? `${plan.discount_year}% Descuento` : undefined;

                    return (
                        <article
                            key={plan.id}
                            style={{ ...cardStyle, padding: "2rem", position: "relative" }}
                        >
                            {plan.slug === "standard" && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "1rem",
                                        left: "1rem",
                                        background: borderColor,
                                        color: "var(--primary-inverse)",
                                        fontSize: "0.75rem",
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "4px",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Popular
                                </span>
                            )}
                            {(plan.slug === "standard" || plan.slug === "advanced") && (
                                <div
                                    style={{
                                        display: "flex",
                                        border: darkBg ? "none" : `1px solid ${borderColor}`,
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                        marginBottom: "1rem",
                                        background: darkBg ? "var(--primary--graytransparent)" : undefined,
                                    }}
                                >
                                    <button
                                        onClick={() => handleCycle(key, "monthly")}
                                        style={{
                                            flex: 1,
                                            padding: "0.5rem",
                                            background: cycle === "monthly" ? "var(--primary-inverse)" : "lightgray",
                                            color: "var(--pico-contrast)",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        Mensual
                                        {cycle === "monthly" && discountMonthlyLabel && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "-0.5rem",
                                                    right: "0.5rem",
                                                    background: "var(--primary-yellow)",
                                                    color: "var(--pico-contrast)",
                                                    fontSize: "0.75rem",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "4px",
                                                    marginBottom: "10px"
                                                }}
                                            >
                                                {discountMonthlyLabel}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleCycle(key, "annual")}
                                        style={{
                                            flex: 1,
                                            padding: "0.5rem",
                                            background: cycle === "annual" ? "var(--primary-inverse)" : "lightgray",
                                            color: "var(--pico-contrast)",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            position: "relative",
                                        }}
                                    >
                                        Anual
                                        {cycle === "annual" && discountYearLabel && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "-0.5rem",
                                                    right: "0.5rem",
                                                    background: "var(--primary-yellow)",
                                                    color: "var(--pico-contrast)",
                                                    fontSize: "0.75rem",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                {discountYearLabel}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}

                            <h3 style={{ marginTop: isStandard ? "2rem" : 0, marginBottom: "0.5rem", color: darkBg ? 'lightgray' : 'var(--pico-color)' }}>
                                {plan.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    marginBottom: "1rem",
                                    opacity: darkBg ? 0.75 : 1,
                                    color: darkBg ? 'lightgray' : 'var(--pico-color)'
                                }}
                            >
                                {plan.description}
                            </p>

                            <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem", color: darkBg ? 'var(--primary-yellow)' : 'var(--pico-color)' }}>
                                {cycle === "annual"
                                    ? Currency.format(plan.price_year)
                                    : Currency.format(plan.price_month)}
                            </div>
                            <div
                                style={{
                                    fontSize: "0.875rem",
                                    marginBottom: "1.5rem",
                                    opacity: 0.75,
                                }}
                            >
                                {cycle === "annual"
                                    ? "Por usuario, por año"
                                    : "Por usuario, por mes"}
                            </div>

                            <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
                                {plan.features.map((feat, idx) => (
                                    <li
                                        key={idx}
                                        style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}
                                    >
                                        <FaCheck
                                            style={{
                                                marginRight: "0.5rem",
                                                color: darkBg ? "var(--primary-yellow)" : borderColor,
                                            }}
                                        />
                                        <span style={{ fontSize: "0.875rem", color: darkBg ? 'lightgray' : 'var(--pico-color)' }}>{feat.text}</span>
                                        {feat.badge && (
                                            <span
                                                style={{
                                                    marginLeft: "0.5rem",
                                                    background: "var(--primary-green)",
                                                    color: "var(--primary-inverse)",
                                                    fontSize: "0.75rem",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                {feat.badge}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelect(plan)}
                                className="contrast"
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    opacity: loading || (plan.slug !== "free" && process.env.DISABLE_ALL_PLANS == 'true') ? 0.6 : 1,
                                    cursor: loading || (plan.slug !== "free" && process.env.DISABLE_ALL_PLANS == 'true') ? "not-allowed" : "pointer",
                                }}
                                disabled={loading || (plan.slug !== "free" && process.env.DISABLE_ALL_PLANS == 'true')}
                            >
                                {plan.slug === "free" ? "Selecciona este plan GRATIS" : "Continuar al pago"}
                            </button>
                        </article>
                    );
                })}
            </div>
        </main>
    );
}
