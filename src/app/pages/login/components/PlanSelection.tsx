export default function PlanSelection({
    onSelect,
}: {
    onSelect: (planId: string) => void;
}) {
    const plans = [
        { id: "basic", name: "Plan Básico", price: "Gratis" },
        { id: "pro", name: "Plan Pro", price: "$10 USD/mes" },
        { id: "premium", name: "Plan Premium", price: "$20 USD/mes" },
    ];

    return (
        <main
            style={{
                padding: "2rem",
                background: "#F9FAFB",
                minHeight: "100vh",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                Selecciona tu plan
            </h2>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            width: "200px",
                            textAlign: "center",
                            background: "#fff",
                        }}
                    >
                        <h3>{plan.name}</h3>
                        <p>{plan.price}</p>
                        <button onClick={() => onSelect(plan.id)}>Seleccionar</button>
                    </div>
                ))}
            </div>
        </main>
    );
}
