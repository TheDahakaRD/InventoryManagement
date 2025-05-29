import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { Material, MaterialFormData } from './types/inventory';
import { MaterialForm } from './components/MaterialForm';
import { LoginForm } from './components/LoginForm';
import { SearchBar } from './components/SearchBar';
import { QuantityAdjuster } from './components/QuantityAdjuster';
import * as inventoryService from './services/inventoryService';
import * as authService from './services/authService';

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadMaterials();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setFilteredMaterials(materials);
  }, [materials]);

  const loadMaterials = async () => {
    const data = await inventoryService.getInventory();
    setMaterials(data);
  };

  const handleLogin = async (username: string, password: string) => {
    const success = await authService.login(username, password);
    if (success) {
      setIsAuthenticated(true);
      setLoginError(undefined);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleSearch = (query: string, field: 'name' | 'category' | 'lastUpdated') => {
    if (!query) {
      setFilteredMaterials(materials);
      return;
    }

    const filtered = materials.filter((material) => {
      const searchValue = field === 'lastUpdated'
        ? new Date(material[field]).toLocaleDateString()
        : material[field].toLowerCase();
      return searchValue.includes(query.toLowerCase());
    });
    setFilteredMaterials(filtered);
  };

  const handleAddMaterial = async (data: MaterialFormData) => {
    await inventoryService.addMaterial(data);
    setIsAddingMaterial(false);
    loadMaterials();
  };

  const handleUpdateMaterial = async (data: MaterialFormData) => {
    if (editingMaterial) {
      await inventoryService.updateMaterial(editingMaterial.id, data);
      setEditingMaterial(null);
      loadMaterials();
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      await inventoryService.deleteMaterial(id);
      loadMaterials();
    }
  };

  const handleQuantityUpdate = async (id: string, newQuantity: number) => {
    await inventoryService.updateQuantity(id, newQuantity);
    loadMaterials();
    setSelectedMaterial(null);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            </div>
            <button
              onClick={() => setIsAddingMaterial(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Material</span>
            </button>
          </div>

          <SearchBar onSearch={handleSearch} />

          {selectedMaterial && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center space-x-4 mb-4">
                  {selectedMaterial.imageUrl && (
                    <img
                      src={selectedMaterial.imageUrl}
                      alt={selectedMaterial.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{selectedMaterial.name}</h2>
                    <p className="text-gray-600">Current quantity: {selectedMaterial.quantity} {selectedMaterial.unit}</p>
                  </div>
                </div>
                <QuantityAdjuster
                  currentQuantity={selectedMaterial.quantity}
                  onAdjust={(newQuantity) => handleQuantityUpdate(selectedMaterial.id, newQuantity)}
                />
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {(isAddingMaterial || editingMaterial) && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                  {isAddingMaterial ? 'Add New Material' : 'Edit Material'}
                </h2>
                <MaterialForm
                  onSubmit={isAddingMaterial ? handleAddMaterial : handleUpdateMaterial}
                  initialData={editingMaterial || undefined}
                  buttonText={isAddingMaterial ? 'Add Material' : 'Update Material'}
                />
                <button
                  onClick={() => {
                    setIsAddingMaterial(false);
                    setEditingMaterial(null);
                  }}
                  className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {filteredMaterials.map((material) => (
                <div
                  key={material.id}
                  onClick={() => setSelectedMaterial(material)}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                >
                  {material.imageUrl ? (
                    <img
                      src={material.imageUrl}
                      alt={material.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{material.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {material.quantity} {material.unit}
                    </p>
                    <p className="text-sm text-gray-600">Category: {material.category}</p>
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMaterial(material);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMaterial(material.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;