// /app/landing/components/Navbar.tsx
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import styles from "../landing.module.css";
import Image from "next/image";

export default function Navbar() {
    const { isMobile } = useDeviceDetect();
    return (
        <header className={styles.header_section}>
            <nav className={styles.navbar}>
                <div className={styles.brand}>
                    <Image src="/images/logo.png" width={40} height={40} alt="Lampo Logo" />
                    <span>Lampo</span>
                </div>
                <ul className={styles.nav_links} style={{ display: isMobile ? 'block' : 'flex' }}>
                    <li><a href="#about">¿Qué es Lampo?</a></li>
                    <li><a href="#features">Beneficios</a></li>
                    <li><a href="#category">Categorias</a></li>
                    <li><a href="/login">Log In</a></li>
                </ul>
            </nav>
        </header>
    );
}
