export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  reorderPoint: number;
  lastUpdated: string;
  imageUrl?: string;
}

export type MaterialFormData = Omit<Material, 'id' | 'lastUpdated'>;