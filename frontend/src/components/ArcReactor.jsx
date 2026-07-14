import { motion } from "framer-motion";

const ArcReactor = ({ size = 280 }) => {
    const r = size / 2;
    const rings = [
        { radius: r * 0.85, strokeWidth: 1.5, dasharray: "8 12", className: "animate-arc-spin" },
        { radius: r * 0.72, strokeWidth: 2, dasharray: "20 10 5 10", className: "animate-arc-spin-reverse" },
        { radius: r * 0.58, strokeWidth: 1, dasharray: "4 8", className: "animate-arc-spin-slow" },
        { radius: r * 0.42, strokeWidth: 2.5, dasharray: "30 15", className: "animate-arc-spin" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative"
            style={{ width: size, height: size }}
        >
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                {/* Outer glow */}
                <defs>
                    <radialGradient id="arc-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.3" />
                        <stop offset="60%" stopColor="var(--accent-blue)" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <circle cx={r} cy={r} r={r * 0.95} fill="url(#arc-glow)" />

                {rings.map((ring, i) => (
                    <circle
                        key={i}
                        cx={r}
                        cy={r}
                        r={ring.radius}
                        fill="none"
                        stroke="var(--accent-blue)"
                        strokeWidth={ring.strokeWidth}
                        strokeDasharray={ring.dasharray}
                        opacity={0.6}
                        className={ring.className}
                        style={{ transformOrigin: "center" }}
                        filter="url(#glow)"
                    />
                ))}

                {/* Center core */}
                <circle cx={r} cy={r} r={r * 0.18} fill="var(--accent-blue)" opacity={0.15} />
                <circle cx={r} cy={r} r={r * 0.1} fill="var(--accent-blue)" opacity={0.4} className="animate-pulse-glow" />
                <circle cx={r} cy={r} r={r * 0.04} fill="var(--text-primary)" opacity={0.9} />

                {/* Decorative tick marks */}
                {Array.from({ length: 36 }).map((_, i) => {
                    const angle = (i * 10 * Math.PI) / 180;
                    const x1 = r + Math.cos(angle) * r * 0.92;
                    const y1 = r + Math.sin(angle) * r * 0.92;
                    const x2 = r + Math.cos(angle) * r * 0.96;
                    const y2 = r + Math.sin(angle) * r * 0.96;
                    return (
                        <line
                            key={i}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="var(--accent-blue)"
                            strokeWidth={i % 3 === 0 ? 2 : 0.5}
                            opacity={i % 3 === 0 ? 0.8 : 0.3}
                        />
                    );
                })}
            </svg>
        </motion.div>
    );
};

export default ArcReactor;
