import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Carousel from "./components/Carousel";
import Categories from "./components/Categories";
import Experience from "./components/Experience";
import BenefitsTabs from "./components/BenefitsTabs";
import InfoSection from "./components/InfoSection";
import Footer from "./components/Footer";
import styles from "./landing.module.css";

export default function LandingPage() {
    return (
        <div className={styles.landing_wrapper} style={{ overflowX: 'hidden' }}>
            <Navbar />
            <main className="no-select">
                <Hero />
                <About>
                    <Carousel />
                </About>
                <Categories />
                <Experience />
                <BenefitsTabs />
                <InfoSection />
            </main>
            <Footer />
        </div>
    );
}
