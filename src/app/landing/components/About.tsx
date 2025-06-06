// app/landing/components/About.tsx
import styles from "../landing.module.css";
import { ReactNode } from "react";

export default function About({ children }: { children: ReactNode }) {
    return (
        <section className={styles.about_section} id="about">
            <div className={styles.about_inner}>
                <div className={styles.about_image}>
                    <img src="/images/picnic.svg" alt="¿Qué es lampo?" width={400} />
                </div>
                <div className={styles.about_text}>
                    <h2>¿Qué es lampo?</h2>
                    <h3>¿Quiénes somos y por qué hacemos lo que hacemos?</h3>
                    <p>
                        Lampo es una plataforma que podrás usar desde una web o un teléfono, para almacenar, consultar y modificar las historias clínicas de tus mascotas, desde cualquier lugar con tu información en la nube segura, esta no permite alteraciones de la información con el tiempo, así tu mascota siempre tendrá toda su información completa y correcta. Podrás también crear alertas para controlar, cuándo administrar su medicina, sus consultas programadas, dieta, vacunas y hasta cuándo debes peinarlo. En lampo amamos nuestras mascotas y que más que eso son nuestros compañeros; y queremos verlos siempre saludables.<br /><br />
                        Somos un grupo de amigos que convive con sus amigos peludos, compañeros que nos inspiran a crear y mejorar por ellos, te los presentamos:
                    </p>
                </div>
            </div>
            <div className={styles.about_carousel}>
                {children}
            </div>
        </section>
    );
}
