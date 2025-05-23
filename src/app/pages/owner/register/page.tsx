// components/PlanSelection.tsx
"use client";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { PlanVersionType } from "@/types/index";
import { SubscriptionRepository } from "@/repos/subscription.repository";
import { PlanRepository } from "@/repos/plan.repository";
import { useAppContext } from "@/app/layout";
import { useRouter } from "next/navigation";

export default function PlanSelection() {
    const router = useRouter();
    const [plans, setPlans] = useState<PlanVersionType[]>([]);
    const [cycles, setCycles] = useState<Record<string, "monthly" | "annual">>(
        {}
    );
    const [loading, setLoading] = useState<boolean>(false);
    const {session } = useAppContext();

    // Carga las versiones de plan vigentes
    useEffect(() => {
        async function load() {
            const data = await PlanRepository.getAllCurrent();
            setPlans(data);
            // Inicializa ciclo por defecto en mensual
            const initialCycles: Record<string, "monthly" | "annual"> = {};
            data.forEach((p) => {
                initialCycles[p.id.toString()] = "monthly";
            });
            setCycles(initialCycles);
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

    const formatPrice = (cents: number) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(cents / 100);

    const handleSelect = async (plan: PlanVersionType) => {
        setLoading(true);
        try {

            const cycle = cycles[plan.id.toString()];
            const priceAtPurchase =
                cycle === "annual" ? plan.price_year : plan.price_month;
            const discountApplied = cycle === "annual" ? plan.discount_year : plan.discount_month;

            // Crea la suscripción en Supabase
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const subscription = await SubscriptionRepository.create({
                ownerId: ownerId,
                planVersionId: plan.id,
                cycle,
                priceAtPurchase,
                discountApplied,
            });

            router.replace("/pages/pet/register");
        } catch (e) {
            console.error("Error creando suscripción:", e);
            // aquí podrías mostrar un toast o mensaje de error
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ padding: "2rem", background: "#F9FAFB" }}>
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
                    const borderColor = "#3B82F6";
                    const darkBg = isStandard;
                    const cardStyle: React.CSSProperties = darkBg
                        ? { background: "#0B1446", color: "#fff", borderRadius: "8px" }
                        : { border: `2px solid ${borderColor}`, background: "#fff", borderRadius: "8px" };

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
                                        color: "#fff",
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
                                        background: darkBg ? "rgba(255,255,255,0.1)" : undefined,
                                    }}
                                >
                                    <button
                                        onClick={() => handleCycle(key, "monthly")}
                                        style={{
                                            flex: 1,
                                            padding: "0.5rem",
                                            background: cycle === "monthly" ? "#fff" : "transparent",
                                            color: darkBg ? "#fff" : "#111",
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
                                                    background: "#FBBF24",
                                                    color: "#111827",
                                                    fontSize: "0.75rem",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "4px",
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
                                            background: cycle === "annual" ? "#fff" : "transparent",
                                            color: darkBg ? "#fff" : "#111",
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
                                                    background: "#FBBF24",
                                                    color: "#111827",
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

                            <h3 style={{ marginTop: isStandard ? "2rem" : 0, marginBottom: "0.5rem" }}>
                                {plan.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    marginBottom: "1rem",
                                    opacity: darkBg ? 0.75 : 1,
                                }}
                            >
                                {plan.description}
                            </p>

                            <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                                {cycle === "annual"
                                    ? formatPrice(plan.price_year)
                                    : formatPrice(plan.price_month)}
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
                                                color: darkBg ? "#FBBF24" : borderColor,
                                            }}
                                        />
                                        <span style={{ fontSize: "0.875rem" }}>{feat.text}</span>
                                        {feat.badge && (
                                            <span
                                                style={{
                                                    marginLeft: "0.5rem",
                                                    background: "#10B981",
                                                    color: "#fff",
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
                                    opacity: loading ? 0.6 : 1,
                                    cursor: loading ? "not-allowed" : "pointer",
                                }}
                                disabled={loading}
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
