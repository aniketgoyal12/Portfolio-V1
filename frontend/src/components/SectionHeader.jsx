import { motion } from "framer-motion";

const SectionHeader = ({ title, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
    >
        <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
            <h2 className="text-2xl md:text-3xl font-display text-foreground tracking-wider text-glow">
                {title}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent" />
        </div>
        {subtitle && (
            <p className="text-muted-foreground font-body text-lg ml-6 tracking-wide">{subtitle}</p>
        )}
    </motion.div>
);

export default SectionHeader;
