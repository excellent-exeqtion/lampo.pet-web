// app/landing/components/InfoSection.tsx
import styles from "../landing.module.css";

export default function InfoSection() {
    return (
        <section className={styles.info_section}>
            <div className={styles.info_top}>
                <div className={styles.info_logo}>
                    <img src="/images/logo.png" alt="" width={32} />
                    <span>Lampo</span>
                </div>
                <div className={styles.social_box}>
                    <a href="#"><img src="/images/tiktok.png" alt="TikTok" width={24} /></a>
                    <a href="#"><img src="/images/instagram.png" alt="Instagram" width={24} /></a>
                    <a href="#"><img src="/images/youtube.png" alt="YouTube" width={24} /></a>
                </div>
            </div>
            <div className={styles.info_links}>
                <h5>Enlaces útiles</h5>
                <ul>
                    <li><a href="#about">¿Qué es Lampo?</a></li>
                    <li><a href="#features">Beneficios</a></li>
                    <li><a href="#category">Categorias</a></li>
                    <li><a href="/login">Log In</a></li>
                </ul>
            </div>
            <div className={styles.info_contact}>
                <div>
                    <img src="/images/location.png" alt="" width={24} />
                    <span>Bogotá</span>
                </div>
                <div>
                    <img src="/images/mail.png" alt="" width={24} />
                    <span>a.aulestia@exe.com.co</span>
                </div>
                <div>
                    <img src="/images/call.png" alt="" width={24} />
                    <span>Cel: +57 314 606 1490</span>
                </div>
            </div>
        </section>
    );
}
