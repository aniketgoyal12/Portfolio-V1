import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import HudCard from "@/components/HudCard.jsx";
import { ShieldAlert } from "lucide-react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden hud-grid bg-background p-4">
            <div className="w-full max-w-md">
                <HudCard label="System Alert // 404" variant="accent">
                    <div className="text-center py-6 space-y-6">
                        <div className="flex justify-center text-primary animate-pulse">
                            <ShieldAlert size={48} />
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-4xl font-display font-bold text-primary text-glow tracking-widest">
                                ERROR_404
                            </h1>
                            <p className="text-sm font-display text-muted-foreground tracking-[0.25em] uppercase">
                                Page Not Found
                            </p>
                        </div>

                        <p className="text-foreground font-body text-base max-w-xs mx-auto leading-relaxed">
                            The requested payload pathway at <code className="px-1.5 py-0.5 bg-muted/40 border border-border text-accent font-mono text-xs">{location.pathname}</code> does not exist or has been disabled.
                        </p>

                        <div className="pt-2">
                            <a 
                                href="/" 
                                className="inline-block px-6 py-2.5 border border-primary/60 bg-primary/10 text-primary font-display text-xs tracking-[0.2em] uppercase hover:bg-primary/20 hover:shadow-[0_0_20px_hsl(0_85%_50%/0.3)] transition-all duration-300"
                            >
                                Return to Terminal
                            </a>
                        </div>
                    </div>
                </HudCard>
            </div>
        </div>
    );
};

export default NotFound;
