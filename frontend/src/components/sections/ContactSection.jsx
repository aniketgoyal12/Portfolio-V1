import SectionHeader from "@/components/SectionHeader.jsx";
import HudCard from "@/components/HudCard.jsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";

const ContactSection = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, connect to backend
        window.location.href = `mailto:goyalaniket2006@gmail.com?subject=Message from ${formData.name}&body=${formData.message}`;
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
                                className="w-full bg-muted/50 border border-border px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-accent/50 transition-colors"
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
                                className="w-full bg-muted/50 border border-border px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-accent/50 transition-colors"
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
                                className="w-full bg-muted/50 border border-border px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-accent/50 transition-colors resize-none"
                                placeholder="Your message..."
                                required
                            />
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px hsl(0 85% 50% / 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 border border-primary/60 bg-primary/10 text-primary font-display text-xs tracking-[0.2em] uppercase hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <Send size={14} />
                            Transmit
                        </motion.button>
                    </form>
                </HudCard>

                <HudCard label="Channels" variant="accent" delay={0.3}>
                    <div className="space-y-6 pt-2">
                        <p className="text-muted-foreground font-body text-base">
                            Open channels for collaboration, opportunities, or system integration requests.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: Mail, label: "Email", value: "goyalaniket2006@gmail.com", href: "mailto:goyalaniket2006@gmail.com" },
                                { icon: Github, label: "GitHub", value: "github.com/Aniketgoyal12", href: "https://github.com/Aniketgoyal12" },
                                { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/aniketgoyal-ag/", href: "https://linkedin.com/in/aniketgoyal-ag/" },
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
                    Engineered by Aniket Goyal · {new Date().getFullYear()}
                </p>
                <p className="text-[10px] font-display text-muted-foreground/50 tracking-widest mt-2">
                    JARVIS Interface v2.0 — All Systems Operational
                </p>
            </motion.div>
        </section>
    );
};

export default ContactSection;
