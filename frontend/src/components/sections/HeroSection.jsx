import { motion } from "framer-motion";
import ArcReactor from "@/components/ArcReactor.jsx";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

const defaultHero = {
    first_name: "Aniket",
    last_name: "Goyal",
    hero_title_p1: "I don't just build projects. ",
    hero_title_p2: "I engineer systems.",
    hero_subtitle: "Full Stack Developer · Systems Engineer"
};

const HeroSection = () => {
    const [heroData, setHeroData] = useState(defaultHero);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const res = await apiFetch("/api/profile/");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.first_name) {
                        setHeroData(data);
                    }
                }
            } catch (e) {
                console.warn("Using local hero fallback parameters", e);
            }
        };
        fetchHero();
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden hud-grid">
            {/* Background radial gradient */}
            <div className="absolute inset-0 pointer-events-none bg-radial-hero" />

            <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
                <ArcReactor size={240} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-wider text-foreground">
                        <span className="text-glow">{heroData.first_name}</span>{" "}
                        <span className="text-glow-secondary text-secondary">{heroData.last_name}</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        className="text-lg md:text-xl font-body text-muted-foreground tracking-widest max-w-xl mx-auto"
                    >
                        {heroData.hero_title_p1}
                        <span className="text-accent text-glow-accent">{heroData.hero_title_p2}</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 2 }}
                        className="text-sm font-display text-muted-foreground tracking-[0.3em] uppercase"
                    >
                        {heroData.hero_subtitle}
                    </motion.p>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.5 }}
                    whileHover={{ scale: 1.05, boxShadow: "var(--glow-shadow-accent)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                    className="mt-4 px-8 py-3 border-2 border-accent bg-accent/10 text-accent font-display text-sm tracking-[0.2em] uppercase hover:bg-accent/20 hover:border-accent transition-all duration-300"
                >
                    Initialize Systems
                </motion.button>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
