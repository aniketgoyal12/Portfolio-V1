import { motion } from "framer-motion";

const colorMap = {
    primary: { stroke: "hsl(0 85% 50%)", glow: "hsl(0 85% 50% / 0.4)" },
    secondary: { stroke: "hsl(43 96% 56%)", glow: "hsl(43 96% 56% / 0.4)" },
    accent: { stroke: "hsl(195 100% 50%)", glow: "hsl(195 100% 50% / 0.4)" },
};

const SkillMeter = ({ label, percentage, color = "accent", delay = 0 }) => {
    const size = 120;
    const strokeWidth = 4;
    const r = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (percentage / 100) * circumference;
    const colors = colorMap[color];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="flex flex-col items-center gap-3"
        >
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="hsl(0 0% 15%)"
                        strokeWidth={strokeWidth}
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke={colors.stroke}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: offset }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
                        style={{
                            filter: `drop-shadow(0 0 6px ${colors.glow})`,
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-display text-foreground">{percentage}%</span>
                </div>
            </div>
            <span className="text-sm font-body text-muted-foreground tracking-wider uppercase">{label}</span>
        </motion.div>
    );
};

export default SkillMeter;
