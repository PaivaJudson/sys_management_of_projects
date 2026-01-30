import { Layout } from "@/components/layout/Layout";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Briefcase, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: projects } = useProjects();

  // Calculate mock stats since we don't have a "get all tickets" endpoint for the dashboard
  // Ideally, backend should provide a stats endpoint. 
  // For now, we'll just show project stats which we have.
  
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter(p => p.status === "active").length || 0;
  const studentProjects = projects?.filter(p => p.type === "student").length || 0;
  const personalProjects = projects?.filter(p => p.type === "personal").length || 0;

  const data = [
    { name: "Student", value: studentProjects, color: "#14b8a6" },  // Teal
    { name: "Personal", value: personalProjects, color: "#6366f1" }, // Indigo
  ];

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active", value: activeProjects, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Completed", value: totalProjects - activeProjects, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Hello, {user?.firstName || "there"}! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold font-display">{stat.value}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg">Project Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 14 }} width={100} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Recent */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-sm bg-gradient-brand text-white border-none">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-display mb-1">Start New Project</h3>
                  <p className="text-white/80 text-sm">Have a new idea? Create a project board to get started.</p>
                </div>
                <Link href="/projects">
                  <Button variant="secondary" className="w-full text-primary font-semibold shadow-lg">
                    Go to Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display text-lg">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects?.slice(0, 3).map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="block">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.type === 'student' ? 'bg-teal-100 text-teal-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          <ListTodo className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{p.type}</p>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${p.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  </Link>
                ))}
                {(!projects || projects.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">No projects yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
