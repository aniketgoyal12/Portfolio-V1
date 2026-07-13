import SectionHeader from "@/components/SectionHeader.jsx";
import SkillMeter from "@/components/SkillMeter.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion } from "framer-motion";

const skillCategories = [
    {
        title: "Programming Languages",
        skills: [
            { name: "Python" },
            { name: "Java" },
            { name: "JavaScript" },
            { name: "SQL" }
        ],
        color: "accent"
    },
    {
        title: "Full Stack",
        skills: [
            { name: "React.js" },
            { name: "Node.js" },
            { name: "Express.js" },
            { name: "Flask" },
            { name: "REST APIs" }
        ],
        color: "primary"
    },
    {
        title: "Generative AI",
        skills: [
            { name: "OpenAI API" },
            { name: "Prompt Engineering" },
            { name: "LLM Integration" },
            { name: "LangChain" },
            { name: "AI Agents" }
        ],
        color: "secondary"
    },
    {
        title: "Databases",
        skills: [
            { name: "MongoDB" },
            { name: "MySQL" }
        ],
        color: "accent"
    },
    {
        title: "Developer Tools",
        skills: [
            { name: "Git" },
            { name: "GitHub" },
            { name: "Linux Command Line" },
            { name: "Postman" }
        ],
        color: "primary"
    },
    {
        title: "Core Computer Science",
        skills: [
            { name: "Data Structures & Algorithms" },
            { name: "Object-Oriented Programming" },
            { name: "DBMS" },
            { name: "Operating Systems" }
        ],
        color: "secondary"
    },
    {
        title: "Practices",
        skills: [
            { name: "API Design" },
            { name: "Debugging" },
            { name: "Code Review" },
            { name: "Agile" },
            { name: "Unit Testing" }
        ],
        color: "accent"
    }
];

const SkillsSection = () => {
    return (
        <section id="skills" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="Suit Capabilities" subtitle="// systems.diagnostic()" />

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