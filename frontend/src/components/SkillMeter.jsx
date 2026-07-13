import { motion } from "framer-motion";

const colorMap = {
    primary: "hsl(0 85% 50%)",
    secondary: "hsl(43 96% 56%)",
    accent: "hsl(195 100% 50%)",
};

const SkillMeter = ({ label, color = "accent", delay = 0 }) => {
    const highlightColor = colorMap[color] || colorMap.accent;

    // Optimize font size and tracking based on label length to prevent overflow
    const isLong = label.length > 12;
    const textSizeClass = isLong
        ? "text-[10px] sm:text-xs tracking-wider"
        : "text-xs sm:text-sm tracking-widest";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -2 }}
            className="group relative flex items-center justify-center py-3.5 px-2 bg-muted/20 border border-border/40 rounded-lg overflow-hidden transition-colors hover:bg-muted/40 min-h-[60px] w-full"
        >
            <div 
                className="absolute left-0 bottom-0 h-[3px] w-full origin-left scale-x-0 opacity-0 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100"
                style={{ 
                    backgroundColor: highlightColor,
                    boxShadow: `0 0 10px ${highlightColor}` 
                }}
            />
            <span className={`relative z-10 font-display text-foreground/90 uppercase text-center whitespace-normal break-words w-full ${textSizeClass}`}>
                {label}
            </span>
        </motion.div>
    );
};

export default SkillMeter;
