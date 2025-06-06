import Image from "next/image";
import styles from "../landing.module.css";

export default function Hero() {
    return (
        <section className={styles.hero_section} id="home">
            <div className={styles.hero_grid}>
                <div>
                    <h1>
                        <b style={{ color: "var(--primary-inverse)" }}>Lampo</b> es una herramienta que <br />
                        ayudará a TU MASCOTA en sus proceso clínicos y veterinarios
                    </h1>
                    <p>
                        Accede y gestiona la historia clínica de tu mascota desde cualquier lugar, de forma segura y confiable.
                    </p>
                    <div className={styles.hero_btns}>
                        {/* Oculta Probar Gratis como en el HTML */}
                        {/* <a className={styles.btn1} style={{ display: "none" }}>Probar gratis</a> */}
                        <a className={styles.btn2} href="mailto:a.aulestia@exe.com.co">
                            Contactar ahora
                        </a>
                    </div>
                </div>
                <div className={styles.hero_image}>
                    <Image src="/images/petting.svg" alt="Petting" width={400} height={400} />
                </div>
            </div>
        </section>
    );
}
