import { ReactNode } from "react";
import { Sidebar, MobileHeader } from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border border-border/50 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-lg shadow-primary/25">
            T
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-3xl">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to manage your projects and tasks effectively.</p>
          </div>
          
          <Button size="lg" className="w-full font-semibold" onClick={() => window.location.href = "/api/login"}>
            Login with Replit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Sidebar />
      <div className="md:pl-64 min-h-screen flex flex-col">
        <MobileHeader />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
