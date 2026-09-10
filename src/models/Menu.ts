export type CategoryType =
  | "Mains"
  | "Appetizers"
  | "Dessert"
  | "Beverages"
  | "Sides";

export interface MenuItem {
  id: number;
  name: string;
  category: CategoryType | string;
  sellingPrice: number;
  costToProduce: number; // Prep Cost ($Loss = WasteUnits * PrepCost)
  isActive?: boolean;
  soldQty?: number;
}

export interface ScannedMenuItem {
  tempId: string;
  name: string;
  category: CategoryType;
  price: number;
  costToProduce: number;
  confidenceScore?: number; // Optional AI extraction certainty (0-1)
}
