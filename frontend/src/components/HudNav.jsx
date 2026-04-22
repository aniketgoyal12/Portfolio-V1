import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
    { label: "Overview", href: "#about" },
    { label: "Capabilities", href: "#skills" },
    { label: "Systems", href: "#projects" },
    { label: "Missions", href: "#experience" },
    { label: "Upgrades", href: "#certifications" },
    { label: "Transmit", href: "#contact" },
];

const HudNav = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border/50" : ""
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                <a href="#" className="font-display text-sm tracking-[0.3em] text-primary text-glow">
                    AG
                </a>
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="px-3 py-1.5 text-[11px] font-display tracking-[0.15em] text-muted-foreground hover:text-accent uppercase transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </motion.nav>
    );
};

export default HudNav;
