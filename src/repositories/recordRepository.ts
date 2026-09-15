import { API_ENABLED, api } from "../api/axios";

export interface RecordPayload {
  batchId?: string;
  menuItemId: number;
  prepTime?: string;
  prepQuantity?: number;
  preparedQty: number;
  soldQty: number;
  wasteQty: number;
  recycleQty?: number;
  wasteCost: number;
  wasteReason: string;
  expirationAt?: string;
  notes?: string;
}

export interface ShiftRecordBatch {
  id?: number;
  date: string;
  shift: "Lunch" | "Dinner" | "Full Day";
  records: RecordPayload[];
  createdAt?: string;
}

export interface ScannedRecordItem {
  menuItemId?: number;
  itemName: string;
  preparedQty: number;
  soldQty: number;
  wasteReason: string;
}

export const recordRepository = {
  // Fetch all logged shift records with optional date filtering
  getAll: async (
    startDate?: string,
    endDate?: string,
  ): Promise<ShiftRecordBatch[]> => {
    if (!API_ENABLED) return [];
    try {
      const response = await api.get("/v1/records", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.warn(
        "Backend API not reachable for getAll records, returning empty array:",
        error,
      );
      return [];
    }
  },

  // Fetch shift record details by ID
  getById: async (id: number): Promise<ShiftRecordBatch | null> => {
    if (!API_ENABLED) return null;
    try {
      const response = await api.get(`/v1/records/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend API not reachable for record ID ${id}:`, error);
      return null;
    }
  },

  // Submit new daily shift records batch
  createBatch: async (payload: ShiftRecordBatch): Promise<ShiftRecordBatch> => {
    if (!API_ENABLED) return payload;
    try {
      const response = await api.post("/v1/records", payload);
      return response.data;
    } catch {
      console.warn(
        "Backend API offline. Simulating successful batch submission:",
        payload,
      );
      // Simulasi jawapan berjaya jika backend belum run
      return payload;
    }
  },

  scanReceipt: async (file: File): Promise<ScannedRecordItem[]> => {
    if (!API_ENABLED) {
      return [
        {
          itemName: "Teriyaki Bento",
          preparedQty: 40,
          soldQty: 34,
          wasteReason: "Unsold End of Shift",
        },
        {
          itemName: "Miso Soup",
          preparedQty: 24,
          soldQty: 21,
          wasteReason: "Quality Control Drop",
        },
      ];
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/v1/records/scan-receipt", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.items ?? response.data;
  },

  // Update existing shift record entry
  updateBatch: async (
    id: number,
    payload: ShiftRecordBatch,
  ): Promise<ShiftRecordBatch> => {
    if (!API_ENABLED) return payload;
    try {
      const response = await api.put(`/v1/records/${id}`, payload);
      return response.data;
    } catch (error) {
      console.warn(`Backend API offline for updateBatch ${id}:`, error);
      return payload;
    }
  },

  // Delete shift record batch by ID
  deleteBatch: async (id: number): Promise<void> => {
    try {
      await api.delete(`/v1/records/${id}`);
    } catch (error) {
      console.warn(`Backend API offline for deleteBatch ${id}:`, error);
    }
  },

  deleteRecord: async (id: string | number): Promise<void> => {
    if (!API_ENABLED) return;
    await api.delete(`/v1/records/${id}`);
  },
};
