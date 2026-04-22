import HudNav from "@/components/HudNav.jsx";
import HeroSection from "@/components/sections/HeroSection.jsx";
import AboutSection from "@/components/sections/AboutSection.jsx";
import SkillsSection from "@/components/sections/SkillsSection.jsx";
import ProjectsSection from "@/components/sections/ProjectsSection.jsx";
import ExperienceSection from "@/components/sections/ExperienceSection.jsx";
import CertificationsSection from "@/components/sections/CertificationsSection.jsx";
import ContactSection from "@/components/sections/ContactSection.jsx";

const Index = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <HudNav />
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <ExperienceSection />
            <CertificationsSection />
            <ContactSection />
        </div>
    );
};

export default Index;
