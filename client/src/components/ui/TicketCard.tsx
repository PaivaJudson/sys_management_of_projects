import { type Ticket } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, User, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useDeleteTicket, useUpdateTicket } from "@/hooks/use-tickets";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const deleteTicket = useDeleteTicket();
  const updateTicket = useUpdateTicket();

  const priorityColors = {
    low: "text-slate-500",
    medium: "text-amber-500",
    high: "text-red-500 font-medium",
  };

  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-card hover:shadow-md transition-shadow border-border/50 group">
        <CardContent className="p-3 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              <h4 className="font-medium text-sm leading-snug">{ticket.title}</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal border-border/50 bg-muted/30">
                  #{ticket.id}
                </Badge>
                <div className={cn("flex items-center gap-1 text-[10px]", priorityColors[ticket.priority as keyof typeof priorityColors])}>
                  <Flag className="w-3 h-3" />
                  <span className="capitalize">{ticket.priority}</span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Move to...</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {statusOptions.map(option => (
                      <DropdownMenuItem 
                        key={option.value}
                        disabled={ticket.status === option.value}
                        onClick={() => updateTicket.mutate({ id: ticket.id, status: option.value })}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => deleteTicket.mutate({ id: ticket.id, projectId: ticket.projectId })}
                >
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {ticket.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {ticket.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-border/30 mt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{ticket.assigneeName || "Unassigned"}</span>
            </div>
            {ticket.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(ticket.dueDate), "MMM d")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
