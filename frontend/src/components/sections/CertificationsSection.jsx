import SectionHeader from "@/components/SectionHeader.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";

const defaultCertifications = [
    {
        title: "Meta Front-End Developer Professional Certificate",
        issuer: "Coursera",
        status: "UNLOCKED",
    },
    {
        title: "GenAI Bootcamp",
        issuer: "Coding Blocks",
        status: "UNLOCKED",
    },
];

const CertificationsSection = () => {
    const [certifications, setCertifications] = useState(defaultCertifications);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await apiFetch("/api/certifications/");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setCertifications(data);
                    }
                }
            } catch (e) {
                console.warn("Using local certifications upgrade grids fallback", e);
            }
        };
        fetchCertificates();
    }, []);

    return (
        <section id="certifications" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="Upgrades Unlocked" subtitle="// certifications.scan()" />

            <div className="grid sm:grid-cols-2 gap-4">
                {certifications.map((cert, i) => (
                    <HudCard key={i} delay={i * 0.1}>
                        <div className="flex items-start gap-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                                className="w-10 h-10 flex items-center justify-center border border-secondary/40 text-secondary shrink-0"
                            >
                                <ShieldCheck size={20} />
                            </motion.div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-display text-foreground tracking-wider">{cert.title}</h3>
                                <p className="text-xs font-body text-muted-foreground">{cert.issuer}</p>
                                <span className="inline-block text-[10px] font-display tracking-[0.3em] text-secondary/80 border border-secondary/20 px-2 py-0.5 mt-1">
                                    {cert.status}
                                </span>
                            </div>
                        </div>
                    </HudCard>
                ))}
            </div>
        </section>
    );
};

export default CertificationsSection;
