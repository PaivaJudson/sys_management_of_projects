import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTicket } from "@shared/schema";

export function useTickets(projectId: number) {
  return useQuery({
    queryKey: [api.tickets.listByProject.path, projectId],
    queryFn: async () => {
      const url = buildUrl(api.tickets.listByProject.path, { id: projectId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return api.tickets.listByProject.responses[200].parse(await res.json());
    },
    enabled: !!projectId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTicket) => {
      // Ensure dates are ISO strings for JSON serialization, handled by Zod on backend
      const res = await fetch(api.tickets.create.path, {
        method: api.tickets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      return api.tickets.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.tickets.listByProject.path, data.projectId] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertTicket>) => {
      const url = buildUrl(api.tickets.update.path, { id });
      const res = await fetch(url, {
        method: api.tickets.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update ticket");
      return api.tickets.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.tickets.listByProject.path, data.projectId] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: number; projectId: number }) => {
      const url = buildUrl(api.tickets.delete.path, { id });
      const res = await fetch(url, {
        method: api.tickets.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete ticket");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.tickets.listByProject.path, variables.projectId] });
    },
  });
}
