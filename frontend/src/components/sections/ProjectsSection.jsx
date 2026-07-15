import SectionHeader from "@/components/SectionHeader.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO.js";

const projects = [
    {
        id: "cag-co",
        name: "CAG-CO",
        codename: "SYS-001",
        description: "Static website for a CA firm",
        stack: ["React", "Vite", "Tailwind CSS"],
        purpose: "Professional digital presence for financial consultancy and accounting services.",
        github: "#",
        live: "#",
        featured: true,
        tags: ["Frontend"],
        features: [
            "Interactive user interface with smooth scrolling and animations",
            "Modern typographic layout built for financial clarity",
            "Fully responsive pages optimized for desktop, tablet, and mobile devices",
            "Structured services index detailing CA audits, taxation, and consultancy offerings"
        ]
    },
    {
        id: "expense-tracker",
        name: "Expense Tracker",
        codename: "SYS-002",
        description: "Responsive expense tracking system with categorized transactions and real-time balance updates.",
        stack: ["React", "JavaScript", "CSS"],
        purpose: "Provide clear visibility into personal spending through structured data and instant feedback.",
        github: "#",
        live: "#",
        tags: ["Frontend"],
        features: [
            "Dynamic transaction logs to add and delete expenditures",
            "Real-time wallet and bank balance auto-calculations",
            "Categorized expenses (e.g. food, transit, leisure) for budget optimization",
            "Responsive dashboard interface with instant input validation"
        ]
    },
    {
        id: "portfolio",
        name: "Personal Portfolio",
        codename: "SYS-003",
        description: "Responsive personal portfolio showcasing projects, skills, and certifications with smooth navigation.",
        stack: ["HTML", "CSS", "JavaScript", "React"],
        purpose: "Professional showcase platform to demonstrate full-stack development and system design skills.",
        github: "#",
        live: "#",
        tags: ["Frontend"],
        features: [
            "High-tech futuristic J.A.R.V.I.S. HUD design system",
            "Custom animated SVG Arc Reactor with interactive core glowing states",
            "Suit Diagnostics dashboard showing technical capabilities and skill meters",
            "Responsive layout configured for optimal rendering on all device widths"
        ]
    },
    {
        id: "snaplink",
        name: "SnapLink — URL Shortener with Auth & Admin Panel",
        codename: "SYS-004",
        description: "A full-stack URL shortener built with Flask and MySQL, with routes, controllers, services, and models kept as separate layers rather than mixed together.",
        stack: ["Flask 3.1", "SQLAlchemy 2.0", "MySQL", "Flask-JWT-Extended", "Flask-Bcrypt", "Flask-Migrate"],
        purpose: "business logic lives in a dedicated service layer, decoupled from HTTP routing",
        github: "#",
        live: "#",
        tags: ["Backend", "Full-Stack"],
        features: [
            "JWT-based user authentication (register/login with encrypted password hashing)",
            "User dashboard: shorten URLs, set custom expiration dates, track click counts, delete links",
            "Admin panel: manage users, disable/delete any link, toggle link status",
            "Custom error pages for broken/disabled/expired links (instead of raw JSON errors)",
            "Dark-slate UI built with vanilla HTML/CSS/JS"
        ]
    },
    {
        id: "medora",
        name: "Medora — Telemedicine Platform",
        codename: "SYS-005",
        description: "A full-stack telemedicine platform supporting four user roles (patient, doctor, admin, superAdmin), covering appointment booking, doctor availability, e-prescriptions, medical records, and doctor ratings.",
        stack: ["React 18", "Express 5", "MongoDB", "Zustand", "Tailwind CSS", "Cloudinary", "Nodemailer"],
        purpose: "Clean separation of concerns on the backend (routes → controllers → models) with 8+ MongoDB collections modeling real clinical workflows.",
        github: "#",
        live: "#",
        tags: ["Full-Stack", "Backend"],
        features: [
            "Role-based access control across 4 user types (patient, doctor, admin, superAdmin)",
            "Appointment booking tied to doctor-defined weekly availability",
            "Prescription and medical record management with Cloudinary file uploads",
            "Doctor rating and feedback systems",
            "Email OTP flow for verification and password resets using Nodemailer"
        ]
    }
];

const ProjectsSection = () => {
    const [projectsList, setProjectsList] = useState(projects);
    const [activeFilter, setActiveFilter] = useState("All");
    const { projectId } = useParams();
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    const [categories, setCategories] = useState(["All", "Frontend", "Backend", "Full-Stack"]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
                const BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
                const [projectsRes, categoriesRes] = await Promise.all([
                    fetch(`${BASE_URL}/api/projects/`),
                    fetch(`${BASE_URL}/api/categories/`)
                ]);

                if (projectsRes.ok) {
                    const data = await projectsRes.json();
                    setProjectsList(data);
                }
                if (categoriesRes.ok) {
                    const data = await categoriesRes.json();
                    setCategories(["All", ...data.map(c => c.name)]);
                }
            } catch (err) {
                console.warn("Unable to connect to backend, using fallback matrix static data.", err);
            }
        };
        fetchProjects();
    }, []);

    const activeProject = projectId
        ? projectsList.find((p) => String(p.id) === String(projectId) || p.slug_id === projectId)
        : null;

    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && activeProject) {
                navigate("/");
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeProject, navigate]);

    // Body scroll lock when modal is open
    useEffect(() => {
        if (activeProject) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [activeProject]);

    // Accessibility Focus Management
    useEffect(() => {
        if (activeProject) {
            previousFocusRef.current = document.activeElement;
            const timer = setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.focus();
                }
            }, 50);
            return () => clearTimeout(timer);
        } else {
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
                previousFocusRef.current = null;
            }
        }
    }, [activeProject]);

    // Call dynamic SEO hook
    useSEO({
        title: activeProject 
            ? `${activeProject.name} | Aniket Goyal` 
            : "Aniket Goyal | Systems Engineer & Full Stack Developer",
        description: activeProject 
            ? activeProject.description 
            : "Portfolio of Aniket Goyal, a Computer Science student and Full Stack Developer specialized in MERN stack and high-performance system design.",
        ogTitle: activeProject ? activeProject.name : "Aniket Goyal | Portfolio",
        ogDescription: activeProject ? activeProject.description : "Systems Engineer & Full Stack Developer Portfolio",
        ogUrl: activeProject 
            ? `https://aniketgoyal.dev/project/${activeProject.slug_id || activeProject.id}` 
            : "https://aniketgoyal.dev",
        ogImage: "/placeholder.svg"
    });

    const filteredProjects = projectsList.filter((project) => {
        if (activeFilter === "All") return true;
        const cat = project.category || "";
        const tags = project.tags || [];
        return cat.includes(activeFilter) || tags.includes(activeFilter);
    });

    // Helper to evaluate if source code and live links are valid (not empty or "#")
    const getRepoLink = (p) => p.repo_link || p.github;
    const getLiveLink = (p) => p.live_link || p.live;
    const hasSourceCode = activeProject && getRepoLink(activeProject) && getRepoLink(activeProject).trim() !== "" && getRepoLink(activeProject).trim() !== "#";
    const hasLiveLink = activeProject && getLiveLink(activeProject) && getLiveLink(activeProject).trim() !== "" && getLiveLink(activeProject).trim() !== "#";

    return (
        <section id="projects" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="Deployed Systems" subtitle="// projects.list()" />

            {/* Filter controls */}
            <div className="flex flex-wrap gap-3 mb-10 justify-center">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        className={`px-4 py-1.5 text-xs font-display tracking-widest uppercase transition-all duration-300 border ${
                            activeFilter === category
                                ? "bg-accent/20 border-accent text-accent text-glow-accent"
                                : "bg-muted/10 border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid gap-8">
                {filteredProjects.map((project, i) => (
                    <div 
                        key={project.id} 
                        onClick={() => navigate(`/project/${project.slug_id || project.id}`)}
                        className="cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-accent"
                        tabIndex={0}
                        id={`project-card-${project.slug_id || project.id}`}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                navigate(`/project/${project.slug_id || project.id}`);
                            }
                        }}
                    >
                        <HudCard
                            label={project.codename}
                            variant={project.featured ? "accent" : "default"}
                            delay={i * 0.1}
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-6 pt-6">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-display text-foreground tracking-wider group-hover:text-accent transition-colors">
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
                                        &quot;{project.long_description || project.purpose}&quot;
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {(project.tech_stack || project.stack || []).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 text-xs font-display tracking-wider border border-accent/30 text-accent/80"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <motion.a
                                        href={project.repo_link || project.github}
                                        onClick={(e) => (project.repo_link === "#" || project.github === "#") && e.preventDefault()}
                                        whileHover={{ scale: 1.1 }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 flex items-center justify-center border transition-colors ${
                                            (project.repo_link === "#" || project.github === "#")
                                                ? "border-border text-muted-foreground/30 cursor-not-allowed"
                                                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                                        }`}
                                    >
                                        <Github size={18} />
                                    </motion.a>
                                    <motion.a
                                        href={project.live_link || project.live}
                                        onClick={(e) => (project.live_link === "#" || project.live === "#") && e.preventDefault()}
                                        whileHover={{ scale: 1.1 }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 flex items-center justify-center border transition-colors ${
                                            (project.live_link === "#" || project.live === "#")
                                                ? "border-border text-muted-foreground/30 cursor-not-allowed"
                                                : "border-border text-muted-foreground hover:text-accent hover:border-accent/40"
                                        }`}
                                    >
                                        <ExternalLink size={18} />
                                    </motion.a>
                                </div>
                            </div>
                        </HudCard>
                    </div>
                ))}
            </div>

            {/* Diagnostic Details Modal */}
            <AnimatePresence>
                {activeProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => navigate("/")}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />

                        {/* Modal Card */}
                        <motion.div
                            ref={modalRef}
                            tabIndex={-1}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border p-6 md:p-8 shadow-2xl z-10 rounded-sm focus:outline-none"
                        >
                            {/* Glowing Corners */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/60 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/60 pointer-events-none" />

                            {/* Scan Line */}
                            <div className="scan-line" />

                            {/* Modal Header */}
                            <div className="flex justify-between items-start border-b border-border pb-4 mb-6">
                                <div>
                                    <span className="text-xs font-display text-accent tracking-[0.2em] uppercase block mb-1">
                                        SYSTEM DIAGNOSTIC // {activeProject.codename || "[DATA MISSING: CODENAME PENDING]"}
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-display text-foreground tracking-wider uppercase">
                                        {activeProject.name || "[DATA MISSING: NAME PENDING]"}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => navigate("/")}
                                    className="p-1.5 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors bg-muted/20"
                                    aria-label="Close modal"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-display text-muted-foreground tracking-[0.2em] uppercase mb-2">{"// core_description"}</h4>
                                    <p className="text-foreground font-body text-base leading-relaxed">
                                        {activeProject.description || "[DATA MISSING: CORE_DESCRIPTION PENDING]"}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-display text-muted-foreground tracking-[0.2em] uppercase mb-2">{"// system_architecture"}</h4>
                                    { (activeProject.long_description || activeProject.purpose) ? (
                                        <p className="text-foreground/85 font-body text-sm italic">
                                            &quot;{activeProject.long_description || activeProject.purpose}&quot;
                                        </p>
                                    ) : (
                                        <p className="text-primary font-body text-sm italic">
                                            [DATA MISSING: SYSTEM_ARCHITECTURE PENDING]
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-xs font-display text-muted-foreground tracking-[0.2em] uppercase mb-2">{"// key_features"}</h4>
                                    { (activeProject.highlights || activeProject.features) && (activeProject.highlights || activeProject.features).length > 0 ? (
                                        <ul className="grid sm:grid-cols-2 gap-3 text-sm font-body text-muted-foreground">
                                            {(activeProject.highlights || activeProject.features).map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-accent shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-primary font-body text-sm italic">
                                            [DATA MISSING: KEY_FEATURES PENDING]
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-xs font-display text-muted-foreground tracking-[0.2em] uppercase mb-2">{"// tech_stack"}</h4>
                                    { (activeProject.tech_stack || activeProject.stack) && (activeProject.tech_stack || activeProject.stack).length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {(activeProject.tech_stack || activeProject.stack).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2.5 py-0.5 text-xs font-display tracking-wider border border-accent/30 text-accent/80 bg-accent/5"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-primary font-body text-sm italic">
                                            [DATA MISSING: TECH_STACK PENDING]
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-4 border-t border-border pt-6 mt-8">
                                <a
                                    href={hasSourceCode ? getRepoLink(activeProject) : undefined}
                                    onClick={(e) => !hasSourceCode && e.preventDefault()}
                                    target={hasSourceCode ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className={`px-4 py-2 border font-display text-xs tracking-wider uppercase flex items-center gap-2 transition-colors ${
                                        !hasSourceCode
                                            ? "border-muted-foreground/20 text-muted-foreground/40 cursor-not-allowed"
                                            : "border-border text-foreground hover:border-foreground/50 hover:bg-muted/10"
                                    }`}
                                >
                                    <Github size={14} />
                                    SOURCE CODE {!hasSourceCode && "(PENDING)"}
                                </a>
                                <a
                                    href={hasLiveLink ? getLiveLink(activeProject) : undefined}
                                    onClick={(e) => !hasLiveLink && e.preventDefault()}
                                    target={hasLiveLink ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className={`px-4 py-2 border font-display text-xs tracking-wider uppercase flex items-center gap-2 transition-colors ${
                                        !hasLiveLink
                                            ? "border-accent/20 bg-accent/5 text-accent/50 cursor-not-allowed"
                                            : "border-accent/60 bg-accent/10 text-accent hover:bg-accent/20"
                                    }`}
                                >
                                    <ExternalLink size={14} />
                                    LIVE MISSION {!hasLiveLink && "(PENDING)"}
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ProjectsSection;