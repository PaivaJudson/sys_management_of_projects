import { Layout } from "@/components/layout/Layout";
import { useProject } from "@/hooks/use-projects";
import { useTickets } from "@/hooks/use-tickets";
import { useRoute } from "wouter";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TicketCard } from "@/components/ui/TicketCard";
import { CreateTicketDialog } from "@/components/dialogs/CreateTicketDialog";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetails() {
  const [, params] = useRoute("/projects/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: tickets, isLoading: ticketsLoading } = useTickets(id);

  if (projectLoading || !project) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </Layout>
    );
  }

  const columns = [
    { id: "todo", title: "To Do", bg: "bg-slate-50 dark:bg-slate-900/20" },
    { id: "in_progress", title: "In Progress", bg: "bg-blue-50 dark:bg-blue-900/10" },
    { id: "review", title: "Review", bg: "bg-amber-50 dark:bg-amber-900/10" },
    { id: "done", title: "Done", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
  ];

  return (
    <Layout>
      <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div>
          <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-display font-bold text-foreground">{project.name}</h1>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-muted-foreground max-w-2xl">{project.description}</p>
            </div>
            
            <CreateTicketDialog projectId={project.id}>
              <Button size="lg" className="shadow-lg shadow-primary/20">Add Task</Button>
            </CreateTicketDialog>
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 h-full min-w-[1000px]">
            {columns.map((col) => {
              const colTickets = tickets?.filter(t => t.status === col.id) || [];
              
              return (
                <div key={col.id} className={`flex-1 rounded-xl p-4 flex flex-col gap-4 border border-border/30 ${col.bg}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                      {col.title}
                    </h3>
                    <span className="bg-background/80 px-2 py-0.5 rounded-md text-xs font-medium border border-border/50">
                      {colTickets.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2 scrollbar-thin">
                    {ticketsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/30" />
                      </div>
                    ) : (
                      <>
                        {colTickets.map(ticket => (
                          <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                        <CreateTicketDialog projectId={project.id} defaultStatus={col.id}>
                          <button className="w-full py-2 text-xs text-muted-foreground hover:text-primary hover:bg-background/50 rounded-lg border border-dashed border-border/50 transition-colors">
                            + Add Task
                          </button>
                        </CreateTicketDialog>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
