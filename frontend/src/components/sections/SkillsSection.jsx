import SectionHeader from "@/components/SectionHeader.jsx";
import SkillMeter from "@/components/SkillMeter.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

const defaultSkills = [
    // Programming Languages
    { name: "Python", category: "Programming Languages", color: "accent" },
    { name: "Java", category: "Programming Languages", color: "accent" },
    { name: "JavaScript", category: "Programming Languages", color: "accent" },
    { name: "SQL", category: "Programming Languages", color: "accent" },
    // Full Stack
    { name: "React.js", category: "Full Stack", color: "primary" },
    { name: "Node.js", category: "Full Stack", color: "primary" },
    { name: "Express.js", category: "Full Stack", color: "primary" },
    { name: "Flask", category: "Full Stack", color: "primary" },
    { name: "REST APIs", category: "Full Stack", color: "primary" },
    // Generative AI
    { name: "OpenAI API", category: "Generative AI", color: "secondary" },
    { name: "Prompt Engineering", category: "Generative AI", color: "secondary" },
    { name: "LLM Integration", category: "Generative AI", color: "secondary" },
    { name: "LangChain", category: "Generative AI", color: "secondary" },
    { name: "AI Agents", category: "Generative AI", color: "secondary" },
    // Databases
    { name: "MongoDB", category: "Databases", color: "accent" },
    { name: "MySQL", category: "Databases", color: "accent" },
    // Developer Tools
    { name: "Git", category: "Developer Tools", color: "primary" },
    { name: "GitHub", category: "Developer Tools", color: "primary" },
    { name: "Linux Command Line", category: "Developer Tools", color: "primary" },
    { name: "Postman", category: "Developer Tools", color: "primary" },
    // Core Computer Science
    { name: "Data Structures & Algorithms", category: "Core Computer Science", color: "secondary" },
    { name: "Object-Oriented Programming", category: "Core Computer Science", color: "secondary" },
    { name: "DBMS", category: "Core Computer Science", color: "secondary" },
    { name: "Operating Systems", category: "Core Computer Science", color: "secondary" },
    // Practices
    { name: "API Design", category: "Practices", color: "accent" },
    { name: "Debugging", category: "Practices", color: "accent" },
    { name: "Code Review", category: "Practices", color: "accent" },
    { name: "Agile", category: "Practices", color: "accent" },
    { name: "Unit Testing", category: "Practices", color: "accent" }
];

const SkillsSection = () => {
    const [skills, setSkills] = useState(defaultSkills);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await apiFetch("/api/skills/");
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setSkills(data);
                    }
                }
            } catch (error) {
                console.warn("Failed to fetch skills from database, using static fallback matrix.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    // Group skills by category
    const skillCategories = skills.reduce((acc, skill) => {
        const existing = acc.find((c) => c.title === skill.category);
        if (existing) {
            existing.skills.push({ name: skill.name });
        } else {
            acc.push({
                title: skill.category,
                skills: [{ name: skill.name }],
                color: skill.color || "accent",
            });
        }
        return acc;
    }, []);

    return (
        <section id="skills" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="Suit Capabilities" subtitle="// systems.diagnostic()" />

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <span className="font-display text-sm text-accent tracking-[0.25em] uppercase animate-pulse">
                        Accessing Database...
                    </span>
                </div>
            ) : skillCategories.length === 0 ? (
                <div className="text-center py-12 border border-border/40 bg-muted/10">
                    <p className="font-display text-sm text-muted-foreground tracking-wider uppercase">
                        No capability records found.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {skillCategories.map((category, ci) => (
                        <HudCard key={category.title} label={category.title} delay={ci * 0.1}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-8">
                                {category.skills.map((skill, si) => (
                                    <SkillMeter
                                        key={skill.name}
                                        label={skill.name}
                                        color={category.color}
                                        delay={ci * 0.05 + si * 0.05}
                                    />
                                ))}
                            </div>
                        </HudCard>
                    ))}
                </div>
            )}

            {/* Tech bar */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-wrap justify-center gap-3"
            >
                {["JWT", "OAuth", "Bcrypt", "Rate Limiting", "CORS", "RBAC", "MVC"].map((tech) => (
                    <span
                        key={tech}
                        className="px-3 py-1 text-xs font-display tracking-wider border border-border text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors cursor-default"
                    >
                        {tech}
                    </span>
                ))}
            </motion.div>
        </section>
    );
};

export default SkillsSection;