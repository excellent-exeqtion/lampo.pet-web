import styles from "../landing.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer_section}>
            <div className="container">
                <p style={{ color: "var(--primary-inverse)" }}>
                    &copy; {new Date().getFullYear()} Todos los derechos reservados Lampo
                </p>
            </div>
        </footer >
    );
}
