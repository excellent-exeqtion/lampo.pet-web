// app/landing/components/BenefitsTabs.tsx
"use client";
import { useState } from "react";
import styles from "../landing.module.css";

const tabs = [
    {
        title: "Control total sobre el historial de tu mascota",
        icon: "/images/admin-panel.png",
        image: "/images/report.svg",
    },
    {
        title: "Consultas desde cualquier lugar del mundo",
        icon: "/images/worldwide.png",
        image: "/images/globe.svg",
    },
    {
        title: "Registro inalterable, autorizado solo por veterinarios validados",
        icon: "/images/hyperlink.png",
        image: "/images/security.svg",
    },
    {
        title: "Tranquilidad para ti y bienestar para tu mascota",
        icon: "/images/pet.png",
        image: "/images/shelter.svg",
    },
];

export default function BenefitsTabs() {
    const [active, setActive] = useState(0);

    return (
        <section className={styles.benefits_section} id="features">
            <div className={styles.benefits_grid}>
                <div>
                    <h2>Beneficios</h2>
                    <div className={styles.benefits_tabs}>
                        {tabs.map((tab, idx) => (
                            <div
                                key={idx}
                                className={`${styles.benefit_tab} ${active === idx ? styles.active : ""}`}
                                onClick={() => setActive(idx)}
                                style={{ cursor: "pointer", marginBottom: "1rem" }}
                            >
                                <img src={tab.icon} alt="" width={48} />
                                <h3>{tab.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.benefit_image_box}>
                    <img src={tabs[active].image} alt={tabs[active].title} width={400} />
                </div>
            </div>
        </section>
    );
}
