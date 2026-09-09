import api from "../api/axios";

export interface RecordPayload {
  menuItemId: number;
  preparedQty: number;
  soldQty: number;
  wasteQty: number;
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
    const response = await api.get("/v1/records", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Fetch shift record details by ID
  getById: async (id: number): Promise<ShiftRecordBatch> => {
    const response = await api.get(`/v1/records/${id}`);
    return response.data;
  },

  // Submit new daily shift records batch
  createBatch: async (payload: ShiftRecordBatch): Promise<ShiftRecordBatch> => {
    const response = await api.post("/v1/records", payload);
    return response.data;
  },

  // Update existing shift record entry
  updateBatch: async (
    id: number,
    payload: ShiftRecordBatch,
  ): Promise<ShiftRecordBatch> => {
    const response = await api.put(`/v1/records/${id}`, payload);
    return response.data;
  },

  // Delete shift record batch by ID
  deleteBatch: async (id: number): Promise<void> => {
    await api.delete(`/v1/records/${id}`);
  },
};
