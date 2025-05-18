// components/PlanSelection.tsx
"use client";
import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

interface Feature {
    text: string;
    badge?: string;
}

interface Plan {
    id: string;
    badge?: string;
    title: string;
    description: string;
    priceMonthly: string;
    priceAnnual: string;
    subtitleMonthly: string;
    subtitleAnnual: string;
    discountLabel?: string;
    features: Feature[];
    cta: string;
    variant: 'free' | 'standard' | 'advanced' | 'lifetime';
}

export default function PlanSelection({
    onSelect,
}: {
    onSelect: (planId: string) => void;
}) {
    // Estado para ciclo de facturación por plan (solo standard y advanced)
    const [cycles, setCycles] = useState<Record<string, 'monthly' | 'annual'>>({
        standard: 'monthly',
        advanced: 'monthly',
    });

    const handleCycle = (planId: string, cycle: 'monthly' | 'annual') => {
        setCycles(prev => ({ ...prev, [planId]: cycle }));
    };

    const plans: Plan[] = [
        {
            id: 'free',
            title: 'Modelo Gratuito',
            description:
                'Para personas nuevas y con necesidades básicas de gestión de Historias clínicas para tu mascota',
            priceMonthly: '$0',
            priceAnnual: '$0',
            subtitleMonthly: 'Por siempre, para todos',
            subtitleAnnual: 'Por siempre, para todos',
            features: [
                { text: '1 perfil de mascota' },
                { text: 'Carga de examenes hasta 500MB' },
                { text: 'Información de contacto' },
                { text: 'Acceso a la APP' },
                { text: 'Plataforma de gestión para tu VET' },
                { text: 'Seguridad de doble factor' },
            ],
            cta: 'Selecciona este plan GRATIS',
            variant: 'free',
        },
        {
            id: 'standard',
            badge: 'Popular',
            title: 'Modelo estándar',
            description:
                'Especial para quienes tienen más de una mascota y quieren utilizar todos nuestros servicios.',
            priceMonthly: '$5 USD',
            priceAnnual: '$54 USD',
            subtitleMonthly: 'Por usuario, por mes',
            subtitleAnnual: 'Por usuario, por año',
            discountLabel: '10% Descuento',
            features: [
                { text: 'Todas las funciones del plan gratuito' },
                { text: 'Perfiles de 3 mascotas' },
                { text: 'Carga de examenes sin limites' },
                { text: 'Función de pérdida de mascota' },
                { text: 'Múltiples sesiones activas en la app' },
                { text: 'Soporte personalizado' },
                { text: 'Plan de recomendados' },
                { text: 'Descargas de copias de historial' },
                { text: 'Lectura en múltiples idiomas', badge: 'Pronto' },
            ],
            cta: 'Inicia tu prueba de 30 días gratis',
            variant: 'standard',
        },
        {
            id: 'advanced',
            title: 'Modelo avanzado',
            description:
                'Diseñado para quien tiene más de una mascota y quiere agregar collares a la suscripción.',
            priceMonthly: '$9 USD',
            priceAnnual: '$86.40 USD',
            subtitleMonthly: 'Per member, per Month',
            subtitleAnnual: 'Per member, per Year',
            discountLabel: '20% Descuento',
            features: [
                { text: 'Todas las funciones del plan gratuito' },
                { text: 'Todas las funciones del plan estándar' },
                { text: 'Perfiles de mascotas ilimitados' },
                { text: 'Plan de recomendados plus' },
                { text: 'Hasta 5 Tags información' },
                { text: 'IA de pre-diagnóstico', badge: 'Coming Soon' },
                { text: 'Sistema de alertas', badge: 'Coming Soon' },
            ],
            cta: 'Inicia tu prueba de 30 días gratis',
            variant: 'advanced',
        },
        {
            id: 'lifetime',
            badge: 'Vitalicio',
            title: 'Vitalicio',
            description:
                'OFERTA ÚNICA POR TIEMPO LIMITADO SOLO VÁLIDO PARA LOS PRIMEROS 1000 USUARIOS',
            priceMonthly: '$150 USD',
            priceAnnual: '$150 USD',
            subtitleMonthly: 'Por usuario, para siempre',
            subtitleAnnual: 'Por usuario, para siempre',
            features: [
                { text: 'Todas las funciones del plan gratuito' },
                { text: 'Todas las funciones del plan estándar' },
                { text: 'Todas las funciones del plan avanzado' },
                { text: 'Hasta 10 Tags información' },
                { text: 'Acceso a nuestra versión Beta' },
                { text: 'Recibes nuevas funcionalidades antes' },
                { text: 'Descuentos únicos en LAMPO' },
                { text: 'Ingreso a nuestro plan fundadores' },
            ],
            cta: 'Adquiere tu plan',
            variant: 'lifetime',
        },
    ];

    return (
        <main style={{ padding: '2rem', background: '#F9FAFB' }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1.5rem',
                }}
            >
                {plans.map(plan => {
                    const cycle = cycles[plan.id] || 'monthly';
                    const borderColor = '#3B82F6';
                    const darkBg = plan.variant === 'standard';
                    const cardStyle: React.CSSProperties =
                        plan.variant === 'free'
                            ? { border: `2px solid ${borderColor}`, background: '#fff', borderRadius: '8px' }
                            : darkBg
                                ? { background: '#0B1446', color: '#fff', borderRadius: '8px' }
                                : { border: `2px solid ${borderColor}`, background: '#fff', borderRadius: '8px' };

                    return (
                        <article
                            key={plan.id}
                            style={{ ...cardStyle, padding: '2rem', position: 'relative', marginTop: plan.variant == 'standard' ? '-15px' : '', marginBottom: plan.variant == 'standard' ? '-15px' : '' }}
                        >
                            {/* Badge */}
                            {plan.badge && plan.variant !== 'standard' && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        background: plan.variant === 'lifetime' ? '#10B981' : '#3B82F6',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {plan.badge}
                                </span>
                            )}
                            {/* Popular badge for standard */}
                            {plan.variant === 'standard' && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        background: '#3B82F6',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginTop: '-20px',
                                        marginBottom: '-20px'
                                    }}
                                >
                                    Popular
                                </span>
                            )}
                            {/* Toggle mensual/anual */}
                            {(plan.variant === 'standard' || plan.variant === 'advanced') && (
                                <div
                                    style={{
                                        display: 'flex',
                                        border: darkBg ? 'none' : `1px solid ${borderColor}`,
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        marginBottom: '1rem',
                                        background: darkBg ? 'rgba(255,255,255,0.1)' : undefined,
                                    }}
                                >
                                    <button
                                        onClick={() => handleCycle(plan.id, 'monthly')}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            background: cycle === 'monthly' ? 'lightgray' : '#fff',
                                            color: '#111',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Mensual
                                    </button>
                                    <button
                                        onClick={() => handleCycle(plan.id, 'annual')}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            background: cycle === 'annual' ? 'lightgray' : '#fff',
                                            color: '#111',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            position: 'relative',
                                        }}
                                    >
                                        Anual
                                    </button>
                                    {cycle === 'annual' && plan.discountLabel && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '-0.5rem',
                                                right: '0.5rem',
                                                background: '#FBBF24',
                                                color: '#111827',
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                marginTop: '10px',
                                                marginRight: '-10px'
                                            }}
                                        >
                                            {plan.discountLabel}
                                        </span>
                                    )}
                                </div>
                            )}
                            {/* Título y descripción */}
                            <h3
                                style={{
                                    marginTop: plan.badge || plan.variant === 'standard' ? '2rem' : 0,
                                    marginBottom: '0.5rem',
                                    color: plan.variant == 'standard' ? 'white' : ''
                                }}
                            >
                                {plan.title}
                            </h3>
                            <p style={{
                                fontSize: '0.875rem', marginBottom: '1rem',
                                color: plan.variant == 'standard' ? 'rgb(255,255,255,0.7)' : ''
                            }}>
                                {plan.description}
                            </p>
                            {/* Precio */}
                            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                {cycle === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                            </div>
                            <div
                                style={{
                                    fontSize: '0.875rem',
                                    marginBottom: '1.5rem',
                                    opacity: 0.75,
                                }}
                            >
                                {cycle === 'annual'
                                    ? plan.subtitleAnnual
                                    : plan.subtitleMonthly}
                            </div>
                            {/* Características */}
                            <ul style={{
                                listStyle: 'none', padding: 0, marginBottom: '1.5rem',
                                color: plan.variant == 'standard' ? 'rgb(255,255,255,0.7)' : ''
                            }}>
                                {plan.features.map((feat, idx) => (
                                    <li
                                        key={idx}
                                        style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}
                                    >
                                        <FaCheck
                                            style={{
                                                marginRight: '0.5rem',
                                                color: darkBg ? '#FBBF24' : '#3B82F6',
                                            }}
                                        />
                                        <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{feat.text}</span>
                                        {feat.badge && (
                                            <span
                                                style={{
                                                    marginLeft: '0.5rem',
                                                    background: '#10B981',
                                                    color: '#fff',
                                                    fontSize: '0.75rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {feat.badge}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {/* Botón CTA */}
                            <button
                                onClick={() => onSelect(plan.id)}
                                className="contrast"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    backgroundColor: plan.variant == 'standard'? '#FBBF24' : '',
                                    color: plan.variant == 'standard' ? 'rgb(11, 20, 70)' : ''
                                }}
                            >
                                {plan.cta}
                            </button>

                            <p style={{ visibility: plan.variant == 'free' ? 'visible' : 'hidden', color: 'gray', fontSize: '16px', marginTop: '20px', whiteSpace: 'nowrap', textAlign: 'center' }}><b>{'Sin tarjetas de crédito ni pagos ocultos.'}</b></p>
                        </article>
                    );
                })}
            </div>
        </main>
    );
}
