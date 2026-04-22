import SectionHeader from "@/components/SectionHeader.jsx";
import SkillMeter from "@/components/SkillMeter.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion } from "framer-motion";

const skillCategories = [
    {
    title: "Frontend Systems",
    skills: [
        { name: "HTML" },
        { name: "CSS" },
        { name: "JavaScript" },
        { name: "React.js" },
        { name: "React Hooks" },
        { name: "Responsive Design" },
    ],
    color: "accent",
},
{
    title: "Backend Architecture",
    skills: [
        { name: "Node.js" },
        { name: "Express.js" },
        { name: "RESTful APIs" },
        { name: "Middleware" },
        { name: "JWT Authentication" },
        { name: "RBAC" },
    ],
    color: "primary",
},
{
    title: "Data & Storage",
    skills: [
        { name: "MongoDB" },
        { name: "Mongoose" },
        { name: "SQL" },
        { name: "Schema Design" },
    ],
    color: "secondary",
},
{
    title: "DevOps & Tools",
    skills: [
        { name: "GitHub" },
        { name: "Postman" },
        { name: "Multer" },
        { name: "REST APIs" },
    ],
    color: "accent",
},

];

const SkillsSection = () => {
    return (
        <section id="skills" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="Suit Capabilities" subtitle="// systems.diagnostic()" />

            <div className="grid md:grid-cols-2 gap-8">
                {skillCategories.map((category, ci) => (
                    <HudCard key={category.title} label={category.title} delay={ci * 0.15}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                            {category.skills.map((skill, si) => (
                                <SkillMeter
                                    key={skill.name}
                                    label={skill.name}
                                    color={category.color}
                                    delay={ci * 0.15 + si * 0.1}
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
                {["JWT", "OAuth", "Bcrypt", "Helmet.js", "Rate Limiting", "CORS", "RBAC", "MVC"].map((tech) => (
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