// app/landing/components/Experience.tsx
import styles from "../landing.module.css";

export default function Experience() {
    return (
        <section className={styles.experience_section}>
            <div className={styles.experience_grid}>
                <div>
                    <img src="/images/computer.svg" alt="Computadora" width={350} />
                </div>
                <div>
                    <h2>¡Sé parte del futuro de la salud animal!</h2>
                    <p>
                        Estamos en fase de desarrollo y queremos que seas de los primeros en probar Lampo.
                    </p>
                    <b>Contáctanos y descubre como puedes hacer parte de nuestro equipo de fundadores, queremos escucharte</b>
                    <div className={styles.experience_btns}>
                        <a href="mailto:a.aulestia@exe.com.co" className={styles.btn3}>Contactar</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
