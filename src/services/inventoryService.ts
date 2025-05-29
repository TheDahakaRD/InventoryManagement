import { Material, MaterialFormData } from '../types/inventory';

// Simulated database
let materials: Material[] = [
  {
    id: '1',
    name: 'Steel Plates',
    quantity: 500,
    unit: 'pieces',
    category: 'Metal',
    reorderPoint: 100,
    lastUpdated: new Date().toISOString(),
    imageUrl: 'https://images.pexels.com/photos/2381463/pexels-photo-2381463.jpeg',
  },
  {
    id: '2',
    name: 'Lumber 2x4',
    quantity: 1000,
    unit: 'feet',
    category: 'Wood',
    reorderPoint: 200,
    lastUpdated: new Date().toISOString(),
    imageUrl: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg',
  },
];

export const getInventory = (): Promise<Material[]> => {
  return Promise.resolve(materials);
};

export const addMaterial = (material: MaterialFormData): Promise<Material> => {
  const newMaterial: Material = {
    ...material,
    id: Math.random().toString(36).substr(2, 9),
    lastUpdated: new Date().toISOString(),
  };
  materials = [...materials, newMaterial];
  return Promise.resolve(newMaterial);
};

export const updateMaterial = (id: string, material: MaterialFormData): Promise<Material> => {
  const updatedMaterial: Material = {
    ...material,
    id,
    lastUpdated: new Date().toISOString(),
  };
  materials = materials.map((m) => (m.id === id ? updatedMaterial : m));
  return Promise.resolve(updatedMaterial);
};

export const updateQuantity = (id: string, quantity: number): Promise<Material> => {
  const material = materials.find(m => m.id === id);
  if (!material) {
    return Promise.reject(new Error('Material not found'));
  }
  
  const updatedMaterial: Material = {
    ...material,
    quantity,
    lastUpdated: new Date().toISOString(),
  };
  
  materials = materials.map((m) => (m.id === id ? updatedMaterial : m));
  return Promise.resolve(updatedMaterial);
};

export const deleteMaterial = (id: string): Promise<void> => {
  materials = materials.filter((m) => m.id !== id);
  return Promise.resolve();
};