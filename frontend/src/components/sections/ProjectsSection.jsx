import SectionHeader from "@/components/SectionHeader.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
    {
    name: "AuditFlow",
    codename: "SYS-001",
    description: "Secure full-stack notes and audit logging platform with role-based access and protected collaboration.",
    stack: ["React", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "RBAC"],
    purpose: "Ensure accountability and traceability of user actions through system-level audit logging.",
    github: "#",
    live: "#",
    featured: true,
},
{
    name: "Expense Tracker",
    codename: "SYS-002",
    description: "Responsive expense tracking system with categorized transactions and real-time balance updates.",
    stack: ["React", "JavaScript", "CSS"],
    purpose: "Provide clear visibility into personal spending through structured data and instant feedback.",
    github: "#",
    live: "#",
},
{
    name: "Personal Portfolio",
    codename: "SYS-003",
    description: "Responsive personal portfolio showcasing projects, skills, and certifications with smooth navigation.",
    stack: ["HTML", "CSS", "JavaScript", "React"],
    purpose: "Professional showcase platform to demonstrate full-stack development and system design skills.",
    github: "#",
    live: "#",
},

];

const ProjectsSection = () => {
    return (
        <section id="projects" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="Deployed Systems" subtitle="// projects.list()" />

            <div className="grid gap-8">
                {projects.map((project, i) => (
                    <HudCard
                        key={project.codename}
                        label={project.codename}
                        variant={project.featured ? "accent" : "default"}
                        delay={i * 0.15}
                    >
                        <div className="flex flex-col md:flex-row md:items-start gap-6 pt-6">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-display text-foreground tracking-wider">
                                        {project.name}
                                    </h3>
                                    {project.featured && (
                                        <span className="px-2 py-0.5 text-[10px] font-display tracking-widest bg-primary/20 text-primary border border-primary/30 uppercase">
                                            Flagship
                                        </span>
                                    )}
                                </div>

                                <p className="text-muted-foreground font-body text-base leading-relaxed">
                                    {project.description}
                                </p>

                                <p className="text-sm font-body text-foreground/70 italic">
                                    "{project.purpose}"
                                </p>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {project.stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-0.5 text-xs font-display tracking-wider border border-accent/30 text-accent/80"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex md:flex-col gap-3 shrink-0">
                                <motion.a
                                    href={project.github}
                                    whileHover={{ scale: 1.1 }}
                                    className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                                >
                                    <Github size={18} />
                                </motion.a>
                                <motion.a
                                    href={project.live}
                                    whileHover={{ scale: 1.1 }}
                                    className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
                                >
                                    <ExternalLink size={18} />
                                </motion.a>
                            </div>
                        </div>
                    </HudCard>
                ))}
            </div>
        </section>
    );
};

export default ProjectsSection;