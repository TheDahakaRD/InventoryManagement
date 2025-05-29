import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantityAdjusterProps {
  currentQuantity: number;
  onAdjust: (newQuantity: number) => void;
}

export function QuantityAdjuster({ currentQuantity, onAdjust }: QuantityAdjusterProps) {
  const [adjustment, setAdjustment] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdjust(currentQuantity + adjustment);
    setAdjustment(0);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <button
        type="button"
        onClick={() => setAdjustment(prev => prev - 1)}
        className="p-1 text-red-600 hover:bg-red-100 rounded"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={adjustment}
        onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
        className="w-20 text-center border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={() => setAdjustment(prev => prev + 1)}
        className="p-1 text-green-600 hover:bg-green-100 rounded"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        type="submit"
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Update
      </button>
    </form>
  );
}