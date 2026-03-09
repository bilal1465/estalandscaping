import { useState, useCallback } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import IntroAnimation, { hasSeenIntro } from "@/components/intro-animation";
import AppShell from "@/components/app-shell";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {showIntro ? (
          <IntroAnimation onComplete={handleIntroComplete} />
        ) : (
          <AppShell>
            <Router />
          </AppShell>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
