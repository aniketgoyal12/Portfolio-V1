import SectionHeader from "@/components/SectionHeader.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { apiFetch } from "@/utils/api";

const ContactSection = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "", website: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [profile, setProfile] = useState({
        owner_email: "goyalaniket2006@gmail.com",
        github_url: "https://github.com/aniketgoyal12",
        github_label: "github.com/aniketgoyal12",
        linkedin_url: "https://linkedin.com/in/aniketgoyal-ag/",
        linkedin_label: "linkedin.com/in/aniketgoyal-ag/",
        first_name: "Aniket",
        last_name: "Goyal"
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiFetch("/api/profile/");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.owner_email) {
                        setProfile(data);
                    }
                }
            } catch (e) {
                console.warn("Using local fallback contact channels", e);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validations
        const nameVal = formData.name.trim();
        const emailVal = formData.email.trim();
        const msgVal = formData.message.trim();

        if (!nameVal || !emailVal || !msgVal) {
            setStatusMessage("Transmission failed: Required fields empty.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            setStatusMessage("Transmission failed: Invalid email format.");
            return;
        }

        setIsSubmitting(true);
        setStatusMessage("Transmitting payload...");

        try {
            const response = await apiFetch("/api/contact/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    message: msgVal,
                    website: formData.website // Honeypot bot detector
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage("Transmission successful.");
                setFormData({ name: "", email: "", message: "", website: "" });
            } else {
                setStatusMessage(data.detail || "Transmission failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setStatusMessage("Connection error. Please check network.");
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatusMessage(""), 5000);
        }
    };

    return (
        <section id="contact" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <SectionHeader title="Transmit Message" subtitle="// comms.open()" />

            <div className="grid md:grid-cols-2 gap-8">
                <HudCard label="Message" delay={0.1}>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div>
                            <label className="text-xs font-display text-muted-foreground tracking-wider uppercase block mb-1.5">
                                Identifier
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent hover:border-accent/40 rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300 focus:shadow-[var(--glow-shadow-secondary)]"
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-display text-muted-foreground tracking-wider uppercase block mb-1.5">
                                Frequency
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent hover:border-accent/40 rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300 focus:shadow-[var(--glow-shadow-secondary)]"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-display text-muted-foreground tracking-wider uppercase block mb-1.5">
                                Payload
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={4}
                                className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent hover:border-accent/40 rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300 focus:shadow-[var(--glow-shadow-secondary)] resize-none"
                                placeholder="Your message..."
                                required
                            />
                        </div>

                        {/* Honeypot field */}
                        <div className="hidden" aria-hidden="true">
                            <input
                                type="text"
                                name="website"
                                value={formData.website || ""}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                tabIndex="-1"
                                autoComplete="off"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "var(--glow-shadow)" } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                            className={`w-full py-2.5 border ${isSubmitting ? 'border-primary/30 bg-primary/5 text-primary/50' : 'border-primary/60 bg-primary/10 text-primary hover:bg-primary/20'} font-display text-xs tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2`}
                        >
                            <Send size={14} className={isSubmitting ? "animate-pulse" : ""} />
                            {isSubmitting ? "Transmitting..." : "Transmit"}
                        </motion.button>
                        
                        {statusMessage && (
                            <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-xs font-display text-center tracking-wider mt-3 ${statusMessage.includes('successful') ? 'text-accent' : (statusMessage.includes('error') || statusMessage.includes('failed') ? 'text-primary' : 'text-muted-foreground')}`}
                            >
                                {statusMessage}
                            </motion.p>
                        )}
                    </form>
                </HudCard>

                <HudCard label="Channels" variant="accent" delay={0.3}>
                    <div className="space-y-6 pt-2">
                        <p className="text-muted-foreground font-body text-base">
                            Open channels for collaboration, opportunities, or system integration requests.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: Mail, label: "Email", value: profile.owner_email, href: `mailto:${profile.owner_email}` },
                                { icon: Github, label: "GitHub", value: profile.github_label, href: profile.github_url },
                                { icon: Linkedin, label: "LinkedIn", value: profile.linkedin_label, href: profile.linkedin_url },
                            ].map((channel, i) => (
                                <motion.a
                                    key={channel.label}
                                    href={channel.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-4 p-3 border border-border/50 hover:border-accent/40 transition-colors group"
                                >
                                    <channel.icon size={18} className="text-muted-foreground group-hover:text-accent transition-colors" />
                                    <div>
                                        <span className="text-xs font-display tracking-wider text-muted-foreground block">{channel.label}</span>
                                        <span className="text-sm font-body text-foreground">{channel.value}</span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </HudCard>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-24 text-center border-t border-border/30 pt-8"
            >
                <p className="text-xs font-display text-muted-foreground tracking-[0.3em] uppercase">
                    Engineered by {profile.first_name} {profile.last_name} · {new Date().getFullYear()}
                </p>
                <p className="text-[10px] font-display text-muted-foreground/50 tracking-widest mt-2">
                    JARVIS Interface v2.0 — All Systems Operational
                </p>
            </motion.div>
        </section>
    );
};

export default ContactSection;
