import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  FolderKanban, 
  LogOut, 
  UserCircle2,
  Settings,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border/50 hidden md:flex flex-col z-30 shadow-xl shadow-black/5">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold font-display shadow-lg shadow-primary/25">
            T
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight">TaskFlow</h1>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            
            return (
              <Link key={link.href} href={link.href} className="block group">
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <h4 className="font-display font-semibold text-sm mb-1">Need Help?</h4>
          <p className="text-xs text-muted-foreground mb-3">Check our documentation for guides and tips.</p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-background">
            Documentation
          </Button>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback>{getInitials(user?.firstName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function MobileHeader() {
  const { user, logout } = useAuth();
  
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold font-display">
          T
        </div>
        <span className="font-display font-bold text-lg">TaskFlow</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">Projects</Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => logout()}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
