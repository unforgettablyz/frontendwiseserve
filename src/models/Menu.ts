export type CategoryType = "Mains" | "Appetizers" | "Dessert" | "Beverages";

export interface MenuItem {
  price: any;
  id: number;
  name: string;
  category: CategoryType;
  sellingPrice: number;
  costToProduce?: number;
  shelfLifeHours: number;
  isActive: boolean;
}

export interface ScannedMenuItem {
  tempId: string;
  name: string;
  category: CategoryType;
  price: number;
  costToProduce: number;
  shelfLifeHours: number;
  confidenceScore?: number; // Optional AI extraction certainty (0-1)
}
