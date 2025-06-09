// app/landing/components/Categories.tsx
import styles from "../landing.module.css";

const categories = [
    {
        name: "Mascotas",
        image: "/images/pets.png",
        description: "La información médica de tus mascotas en solo lugar.",
    },
    {
        name: "Veterinaria",
        image: "/images/vet.png",
        description: "Lleva el control veterinario de tu mascota sin importar donde sea atendido.",
    },
    {
        name: "Historias clínicas",
        image: "/images/clinic-history.png",
        description: "Organiza tratamientos, vacunas y seguimientos con claridad y accesibilidad sin importar donde te encuentres.",
    },
    {
        name: "Trazabilidad",
        image: "/images/traceability.png",
        description: "Registros inalterables, seguros y siempre disponibles desde cualquier lugar.",
    },
];

export default function Categories() {
    return (
        <section className={styles.category_section} id="category">
            <div className={styles.heading_container}>
                <h2>Categorías</h2>
            </div>
            <div className={styles.category_container}>
                {categories.map((cat) => (
                    <div key={cat.name} className={styles.category_box}>
                        <img src={cat.image} alt={cat.name} width={150} />
                        <h3><b>{cat.name}</b></h3>
                        <p>{cat.description}</p>
                    </div>
                ))}
            </div>
        </section >
    );
}
