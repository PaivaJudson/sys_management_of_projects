import { Link } from "wouter";
import { type Project } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Folder, ArrowRight, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteProject } from "@/hooks/use-projects";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function ProjectCard({ project }: { project: Project }) {
  const deleteProject = useDeleteProject();

  const isStudent = project.type === "student";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="h-full flex flex-col overflow-hidden border-border/60 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardHeader className="p-5 pb-3">
          <div className="flex justify-between items-start">
            <div className="flex gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={`
                  ${isStudent 
                    ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" 
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  } hover:bg-opacity-80 transition-colors
                `}
              >
                {isStudent ? "Student Project" : "Personal Project"}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this project?")) {
                      deleteProject.mutate(project.id);
                    }
                  }}
                >
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <h3 className="font-display font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {project.name}
          </h3>
        </CardHeader>
        
        <CardContent className="p-5 pt-0 flex-1">
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 h-16">
            {project.description || "No description provided."}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>Created {project.createdAt ? format(new Date(project.createdAt), "MMM d, yyyy") : "Recently"}</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 mt-auto">
          <Link href={`/projects/${project.id}`} className="w-full">
            <Button className="w-full justify-between group" variant="secondary">
              View Board
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-muted-foreground group-hover:text-foreground" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
