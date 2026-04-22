import SectionHeader from "@/components/SectionHeader.jsx";
import { motion } from "framer-motion";

const experiences = [
    {
        role: "Full Stack Developer Intern",
        org: "Tech Organization",
        period: "2026",
        contributions: [
    "Developed RESTful APIs for a Project Management System using Node.js and Express",
    "Implemented role-based access control with JWT authentication",
    "Designed project and task modules with auto-generated code logic and MongoDB",
    "Structured and documented APIs to streamline intern-manager task workflow"
],

    },
];

const ExperienceSection = () => {
    return (
        <section id="experience" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="Mission Logs" subtitle="// experience.timeline()" />

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

                {experiences.map((exp, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.2 }}
                        className="relative pl-12 md:pl-20 pb-12"
                    >
                        {/* Timeline dot */}
                        <div className="absolute left-4 md:left-8 top-1 w-3 h-3 border-2 border-primary bg-background rounded-full -translate-x-1/2">
                            <div className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-glow" />
                        </div>

                        <div className="hud-card">
                            <div className="scan-line" />
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <h3 className="text-lg font-display text-foreground tracking-wider">{exp.role}</h3>
                                <span className="text-xs font-display text-secondary tracking-[0.3em]">{exp.period}</span>
                            </div>
                            <p className="text-sm font-display text-muted-foreground tracking-wider mb-4">{exp.org}</p>

                            <ul className="space-y-3">
                                {exp.contributions.map((c, j) => (
                                    <motion.li
                                        key={j}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + j * 0.1 }}
                                        className="flex items-start gap-3 text-sm font-body text-muted-foreground"
                                    >
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-accent shrink-0" />
                                        {c}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ExperienceSection;
