import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index.jsx";

const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Suspense fallback={
                        <div className="min-h-screen bg-background text-muted-foreground flex flex-col items-center justify-center gap-4 font-display text-xs tracking-widest uppercase">
                            <span className="animate-pulse">Initializing System...</span>
                        </div>
                    }>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/project/:projectId" element={<Index />} />
                            <Route path="/admin" element={<AdminPage />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
