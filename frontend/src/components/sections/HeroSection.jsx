import { motion } from "framer-motion";
import ArcReactor from "@/components/ArcReactor.jsx";

const HeroSection = () => {
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
                        <span className="text-glow">Aniket</span>{" "}
                        <span className="text-glow-secondary text-secondary">Goyal</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        className="text-lg md:text-xl font-body text-muted-foreground tracking-widest max-w-xl mx-auto"
                    >
                        I don&apos;t just build projects.{" "}
                        <span className="text-accent text-glow-accent">I engineer systems.</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 2 }}
                        className="text-sm font-display text-muted-foreground tracking-[0.3em] uppercase"
                    >
                        Full Stack Developer · Systems Engineer
                    </motion.p>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.5 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(0 85% 50% / 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                    className="mt-4 px-8 py-3 border border-primary/60 bg-primary/10 text-primary font-display text-sm tracking-[0.2em] uppercase hover:bg-primary/20 transition-colors"
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
