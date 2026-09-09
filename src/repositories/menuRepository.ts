import { api } from "../api/axios";
import { MenuItem } from "../models/Menu";

export const menuRepository = {
  // GET /api/v1/menu?status=active
  getAll: async (status: string = "active"): Promise<MenuItem[]> => {
    const response = await api.get("/v1/menu", { params: { status } });
    return response.data;
  },

  // POST /api/v1/menu
  create: async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
    const response = await api.post("/v1/menu", {
      name: item.name,
      price: item.price,
      category: item.category,
      cost_to_produce: item.costToProduce,
    });
    return response.data;
  },

  // PUT /api/v1/menu/:id
  update: async (id: number, item: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await api.put(`/v1/menu/${id}`, {
      price: item.price,
      cost_to_produce: item.costToProduce,
      status: item.isActive ? "active" : "archived",
    });
    return response.data;
  },

  // DELETE /api/v1/menu/:id
  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/menu/${id}`);
  },
};