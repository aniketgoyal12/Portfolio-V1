import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { apiFetch } from "@/utils/api";

const navItems = [
    { label: "Overview", href: "#about" },
    { label: "Capabilities", href: "#skills" },
    { label: "Systems", href: "#projects" },
    { label: "Missions", href: "#experience" },
    { label: "Upgrades", href: "#certifications" },
    { label: "Transmit", href: "#contact" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        }
    }
};

const itemVariants = {
    hidden: { 
        opacity: 0, 
        x: -30 
    },
    show: { 
        opacity: [0, 0.8, 0.2, 1], // flickering HUD lock-in effect
        x: 0,
        transition: {
            x: { type: "spring", stiffness: 120, damping: 14 },
            opacity: { duration: 0.35, ease: "linear" }
        }
    }
};

const HudNav = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoInitials, setLogoInitials] = useState("AG");

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener("scroll", onScroll);
        
        const fetchLogo = async () => {
            try {
                const res = await apiFetch("/api/profile/");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.logo_initials) {
                        setLogoInitials(data.logo_initials);
                    }
                }
            } catch (e) {
                console.warn("Using local brand fallback initials", e);
            }
        };
        fetchLogo();

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled || mobileOpen
                        ? "bg-background/90 backdrop-blur-md border-b border-border/50"
                        : ""
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                    <a href="#" className="font-display text-sm tracking-[0.3em] text-primary text-glow">
                        {logoInitials}
                    </a>
                    
                    <div className="flex items-center gap-4">
                        {/* Desktop Nav Items */}
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



                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle Menu"
                            className="md:hidden w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors bg-muted/10 rounded-sm"
                        >
                            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-x-0 top-[57px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 md:hidden"
                    >
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="flex flex-col py-6 px-6 gap-4"
                        >
                            {navItems.map((item) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    variants={itemVariants}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-2.5 px-4 font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-accent border-b border-border/20 last:border-b-0 uppercase transition-colors"
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default HudNav;
