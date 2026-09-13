import { api } from "../api/axios";

export interface RecordPayload {
  batchId?: string;
  menuItemId: number;
  prepTime?: string;
  preparedQty: number;
  soldQty: number;
  wasteQty: number;
  recycleQty?: number;
  wasteCost: number;
  wasteReason: string;
}

export interface ShiftRecordBatch {
  id?: number;
  date: string;
  shift: "Lunch" | "Dinner" | "Full Day";
  records: RecordPayload[];
  createdAt?: string;
}

export const recordRepository = {
  // Fetch all logged shift records with optional date filtering
  getAll: async (
    startDate?: string,
    endDate?: string,
  ): Promise<ShiftRecordBatch[]> => {
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
    try {
      const response = await api.post("/v1/records", payload);
      return response.data;
    } catch (error) {
      console.warn(
        "Backend API offline. Simulating successful batch submission:",
        payload,
      );
      // Simulasi jawapan berjaya jika backend belum run
      return payload;
    }
  },

  // Update existing shift record entry
  updateBatch: async (
    id: number,
    payload: ShiftRecordBatch,
  ): Promise<ShiftRecordBatch> => {
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
};
