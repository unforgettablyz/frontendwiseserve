import { API_ENABLED, api } from "../api/axios";
import { MenuItem, ScannedMenuItem } from "../models/Menu";

let previewMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Teriyaki Bento",
    category: "Mains",
    price: 18,
    sellingPrice: 18,
    costToProduce: 7.5,
    shelfLifeHours: 12,
    isActive: true,
  },
  {
    id: 2,
    name: "Sashimi Plate",
    category: "Mains",
    price: 26,
    sellingPrice: 26,
    costToProduce: 12,
    shelfLifeHours: 24,
    isActive: true,
  },
  {
    id: 3,
    name: "Miso Soup",
    category: "Appetizers",
    price: 8,
    sellingPrice: 8,
    costToProduce: 2.5,
    shelfLifeHours: 4,
    isActive: true,
  },
];

const normalizeMenuItem = (item: any): MenuItem => ({
  ...item,
  price: item.price ?? item.sellingPrice ?? 0,
  sellingPrice: item.sellingPrice ?? item.price ?? 0,
  costToProduce: item.costToProduce ?? item.cost ?? item.cost_to_produce ?? 0,
  shelfLifeHours: Number(item.shelfLifeHours ?? item.shelf_life_hours ?? 24),
  isActive: item.isActive ?? (item.status ? item.status === "active" : true),
});

export const menuRepository = {
  getAll: async (status: string = "active"): Promise<MenuItem[]> => {
    if (!API_ENABLED) {
      return previewMenuItems.filter((item) =>
        status === "all" ? true : item.isActive,
      );
    }
    const response = await api.get("/v1/menu", { params: { status } });
    return response.data.map(normalizeMenuItem);
  },

  create: async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
    if (!API_ENABLED) {
      const createdItem = normalizeMenuItem({ ...item, id: Date.now() });
      previewMenuItems = [createdItem, ...previewMenuItems];
      return createdItem;
    }
    const response = await api.post("/v1/menu", {
      name: item.name,
      price: item.sellingPrice ?? item.price,
      category: item.category,
      cost_to_produce: item.costToProduce,
      shelf_life_hours: item.shelfLifeHours,
      status: item.isActive ? "active" : "archived",
    });
    return normalizeMenuItem(response.data);
  },

  update: async (id: number, item: Partial<MenuItem>): Promise<MenuItem> => {
    if (!API_ENABLED) {
      previewMenuItems = previewMenuItems.map((menuItem) =>
        menuItem.id === id ? { ...menuItem, ...item } : menuItem,
      );
      return normalizeMenuItem(
        previewMenuItems.find((menuItem) => menuItem.id === id),
      );
    }
    const response = await api.put(`/v1/menu/${id}`, {
      name: item.name,
      price: item.sellingPrice ?? item.price,
      category: item.category,
      cost_to_produce: item.costToProduce,
      shelf_life_hours: item.shelfLifeHours,
      status: item.isActive ? "active" : "archived",
    });
    return normalizeMenuItem(response.data);
  },

  scanMenu: async (file: File): Promise<ScannedMenuItem[]> => {
    if (!API_ENABLED) {
      return [
        {
          tempId: "preview-1",
          name: "Tonkotsu Ramen",
          category: "Mains",
          price: 14.5,
          costToProduce: 4.8,
          shelfLifeHours: 12,
        },
        {
          tempId: "preview-2",
          name: "Chicken Gyoza",
          category: "Appetizers",
          price: 6.5,
          costToProduce: 1.9,
          shelfLifeHours: 8,
        },
      ];
    }

    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/v1/menu/scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.items ?? response.data;
  },

  delete: async (id: number): Promise<void> => {
    if (!API_ENABLED) {
      previewMenuItems = previewMenuItems.filter((item) => item.id !== id);
      return;
    }
    await api.delete(`/v1/menu/${id}`);
  },
};
