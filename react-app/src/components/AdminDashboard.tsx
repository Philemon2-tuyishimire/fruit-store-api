import React, { useState } from 'react';
import { Fruit } from '../data/mockFruits';
import { Plus, Edit2, Trash2, X, Save, ShieldAlert } from 'lucide-react';
import { useAddFruit, useUpdateFruit, useDeleteFruit } from '../hooks/useFruitsQuery';

interface AdminDashboardProps {
  fruits: Fruit[];
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  fruits,
  onClose,
}) => {
  const [editingFruit, setEditingFruit] = useState<Fruit | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // TanStack Query Mutation Hooks
  const addFruitMutation = useAddFruit();
  const updateFruitMutation = useUpdateFruit();
  const deleteFruitMutation = useDeleteFruit();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 100,
    category: 'Tree Fruits' as Fruit['category'],
    imageUrl: '',
  });

  const handleOpenAdd = () => {
    setEditingFruit(null);
    setFormData({
      name: '',
      description: '',
      price: 4500,
      stock: 100,
      category: 'Tree Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60',
    });
    setIsAddingNew(true);
  };

  const handleOpenEdit = (fruit: Fruit) => {
    setIsAddingNew(false);
    setEditingFruit(fruit);
    setFormData({
      name: fruit.name,
      description: fruit.description,
      price: fruit.price,
      stock: fruit.stock,
      category: fruit.category,
      imageUrl: fruit.imageUrl,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingNew) {
      addFruitMutation.mutate(formData, {
        onSuccess: () => {
          resetForm();
        },
        onError: (err) => {
          alert(`Failed to add fruit: ${err.message}`);
        }
      });
    } else if (editingFruit) {
      updateFruitMutation.mutate(
        {
          ...editingFruit,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          imageUrl: formData.imageUrl,
        },
        {
          onSuccess: () => {
            resetForm();
          },
          onError: (err) => {
            alert(`Failed to update fruit: ${err.message}`);
          }
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fruit from the catalog?')) {
      deleteFruitMutation.mutate(id, {
        onError: (err) => {
          alert(`Failed to delete fruit: ${err.message}`);
        }
      });
    }
  };

  const resetForm = () => {
    setIsAddingNew(false);
    setEditingFruit(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold">FruitStore Admin Dashboard</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Manage your catalog items ({fruits.length} total fruits)</p>
            {!isAddingNew && !editingFruit && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Fruit
              </button>
            )}
          </div>

          {/* Add / Edit Form Modal Box */}
          {(isAddingNew || editingFruit) && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {isAddingNew ? 'Add New Fruit Item' : `Edit Fruit: ${editingFruit?.name}`}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fruit Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Organic Dragonfruit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Fruit['category'] })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Tree Fruits">Tree Fruits</option>
                    <option value="Tropical">Tropical</option>
                    <option value="Citrus">Citrus</option>
                    <option value="Berries">Berries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addFruitMutation.isPending || updateFruitMutation.isPending}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium shadow transition cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> 
                  {isAddingNew 
                    ? (addFruitMutation.isPending ? 'Saving...' : 'Save Fruit') 
                    : (updateFruitMutation.isPending ? 'Updating...' : 'Update Changes')}
                </button>
              </div>
            </form>
          )}

          {/* Table of Fruits with Horizontal Scroll for Mobile */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm border-b">
                  <th className="p-3">Fruit</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {fruits.map((fruit) => (
                  <tr key={fruit._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 flex items-center gap-3">
                      <img 
                        src={fruit.imageUrl} 
                        alt={fruit.name} 
                        className="w-10 h-10 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{fruit.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{fruit.description}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {fruit.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-gray-700">{fruit.price.toLocaleString()} RWF</td>
                    <td className="p-3 text-gray-600">{fruit.stock} units</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(fruit)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-block cursor-pointer"
                        title="Edit Fruit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fruit._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition inline-block cursor-pointer"
                        title="Delete Fruit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};