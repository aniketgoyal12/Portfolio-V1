import SectionHeader from "@/components/SectionHeader.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion } from "framer-motion";

const stats = [
    { label: "Stack", value: "MERN" },
    { label: "Focus", value: "Full Stack" },
    { label: "Approach", value: "System Design" },
    { label: "Status", value: "Active" },
];

const AboutSection = () => {
    return (
        <section id="about" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="System Overview" subtitle="// profile.init()" />

            <div className="grid md:grid-cols-3 gap-6">
                <HudCard label="Bio" className="md:col-span-2" delay={0.1}>
                    <p className="text-foreground font-body text-lg leading-relaxed mb-4">
                        Computer Science student and Full Stack Developer who approaches every project like building a high-performance system.
                        Specializing in the MERN stack with a deep focus on scalable architecture, secure authentication, and production-grade engineering.
                    </p>
                    <p className="text-muted-foreground font-body text-base leading-relaxed">
                        From audit management platforms to real-time expense trackers, every system I build prioritizes
                        reliability, modularity, and clean engineering. I don't just write code — I architect solutions
                        that scale under pressure.
                    </p>
                </HudCard>

                <HudCard label="Diagnostics" variant="accent" delay={0.3}>
                    <div className="space-y-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex justify-between items-center border-b border-border/50 pb-2"
                            >
                                <span className="text-xs font-display text-muted-foreground tracking-wider uppercase">{stat.label}</span>
                                <span className="text-sm font-body text-accent">{stat.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </HudCard>
            </div>
        </section>
    );
};

export default AboutSection;
