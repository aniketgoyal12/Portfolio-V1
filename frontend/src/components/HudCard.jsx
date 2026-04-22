import { motion } from "framer-motion";

const HudCard = ({ children, label, variant = "default", className = "", delay = 0 }) => {
    const variantClass = variant === "accent" ? "hud-card-accent" : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={`relative pt-3 ${className}`}
        >
            {label && (
                <div className="absolute top-0 left-10 -translate-y-1/2 px-3 py-0.5 bg-background z-10">
                    <span className="text-xs font-display tracking-widest text-muted-foreground uppercase">
                        {label}
                    </span>
                </div>
            )}
            <div className={`hud-card ${variantClass} h-full`}>
                <div className="scan-line" />
                {children}
            </div>
        </motion.div>
    );
};

export default HudCard;