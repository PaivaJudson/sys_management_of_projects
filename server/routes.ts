import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Projects
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.projects.update.path, async (req, res) => {
    try {
      const input = api.projects.update.input.parse(req.body);
      const project = await storage.updateProject(Number(req.params.id), input);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.projects.delete.path, async (req, res) => {
    await storage.deleteProject(Number(req.params.id));
    res.status(204).send();
  });

  // Tickets
  app.get(api.tickets.listByProject.path, async (req, res) => {
    const tickets = await storage.getTicketsByProject(Number(req.params.id));
    res.json(tickets);
  });

  app.post(api.tickets.create.path, async (req, res) => {
    try {
      const input = api.tickets.create.input.parse(req.body);
      const ticket = await storage.createTicket(input);
      res.status(201).json(ticket);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.tickets.update.path, async (req, res) => {
    try {
      const input = api.tickets.update.input.parse(req.body);
      const ticket = await storage.updateTicket(Number(req.params.id), input);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.json(ticket);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.tickets.delete.path, async (req, res) => {
    await storage.deleteTicket(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    const project1 = await storage.createProject({
      name: "Final Year Thesis",
      description: "Research on AI agents",
      type: "student",
      status: "active"
    });
    
    await storage.createTicket({
      title: "Literature Review",
      description: "Read top 5 papers on LLMs",
      status: "done",
      priority: "high",
      projectId: project1.id,
      assigneeName: "Student A"
    });

    await storage.createTicket({
      title: "Prototype Design",
      description: "Sketch UI for the dashboard",
      status: "in_progress",
      priority: "medium",
      projectId: project1.id,
      assigneeName: "Student A"
    });

    const project2 = await storage.createProject({
      name: "Home Renovation",
      description: "Tracking tasks for kitchen remodel",
      type: "personal",
      status: "active"
    });

    await storage.createTicket({
      title: "Call Contractors",
      description: "Get quotes from 3 plumbers",
      status: "todo",
      priority: "medium",
      projectId: project2.id,
      assigneeName: "Me"
    });
  }
}
