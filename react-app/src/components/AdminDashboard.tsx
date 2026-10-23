import React, { useState, useEffect } from 'react';
import { Fruit } from '../data/mockFruits';
import { Plus, Edit2, Trash2, X, Save, ShieldAlert, Users, Layers, UserX } from 'lucide-react';
import { useAddFruit, useUpdateFruit, useDeleteFruit } from '../hooks/useFruitsQuery';
import { fetchAllUsers, deleteUserById } from '../services/api';

interface AdminDashboardProps {
  fruits: Fruit[];
  onClose: () => void;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  fruits,
  onClose,
}) => {
  const [editingFruit, setEditingFruit] = useState<Fruit | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'users'>('catalog');

  // User management state (Admin only) - fixed typo from UserState to useState
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  // Get current user role and ID from localStorage
  const userRole = localStorage.getItem('role') || 'customer';
  const currentUserName = localStorage.getItem('userName') || '';

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

  // Fetch users if admin
  useEffect(() => {
    if (userRole === 'admin') {
      loadUsers();
    }
  }, [userRole]);

  const loadUsers = async () => {
    try {
      setUserLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      try {
        await deleteUserById(userId);
        setUsers(users.filter((u: UserProfile) => u._id !== userId));
      } catch (err: any) {
        alert(`Failed to delete user: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  // Filter fruits based on role: Sellers only see fruits they added; Admins see all
  const displayedFruits = userRole === 'seller'
    ? fruits.filter((f: any) => f.createdBy === currentUserName || f.createdBy?.name === currentUserName || !f.createdBy)
    : fruits;

  // Category counts
  const categoryCounts = {
    'Tree Fruits': displayedFruits.filter((f: Fruit) => f.category === 'Tree Fruits').length,
    'Tropical': displayedFruits.filter((f: Fruit) => f.category === 'Tropical').length,
    'Citrus': displayedFruits.filter((f: Fruit) => f.category === 'Citrus').length,
    'Berries': displayedFruits.filter((f: Fruit) => f.category === 'Berries').length,
  };

  // User counts (Admin only)
  const userCounts = {
    total: users.length,
    admins: users.filter((u: UserProfile) => u.role === 'admin').length,
    sellers: users.filter((u: UserProfile) => u.role === 'seller').length,
    buyers: users.filter((u: UserProfile) => u.role === 'customer').length,
  };

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
        onError: (err: any) => {
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
          onError: (err: any) => {
            alert(`Failed to update fruit: ${err.message}`);
          }
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fruit from the catalog?')) {
      deleteFruitMutation.mutate(id, {
        onError: (err: any) => {
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
            <h2 className="text-xl font-bold">
              {userRole === 'admin' ? 'Admin Portal Dashboard' : 'Seller Dashboard'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs for Admin */}
        {userRole === 'admin' && (
          <div className="flex border-b bg-gray-100 px-6 pt-3 gap-4">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`pb-3 px-4 font-semibold text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'catalog' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Fruit Catalog Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-4 font-semibold text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'users' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              User Management ({userCounts.total})
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          
          {/* --- ADMIN: USER MANAGEMENT TAB --- */}
          {userRole === 'admin' && activeTab === 'users' ? (
            <div>
              {/* User Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase font-bold">Total Users</p>
                  <p className="text-2xl font-black text-gray-800">{userCounts.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs text-emerald-600 uppercase font-bold">Admins</p>
                  <p className="text-2xl font-black text-emerald-700">{userCounts.admins}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs text-blue-600 uppercase font-bold">Sellers</p>
                  <p className="text-2xl font-black text-blue-700">{userCounts.sellers}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs text-purple-600 uppercase font-bold">Buyers</p>
                  <p className="text-2xl font-black text-purple-700">{userCounts.buyers}</p>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm border-b">
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {users.map((u: UserProfile) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition">
                        <td className="p-3 font-semibold text-gray-800">{u.name}</td>
                        <td className="p-3 text-gray-600">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            u.role === 'admin' ? 'bg-emerald-100 text-emerald-800' :
                            u.role === 'seller' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                            title="Delete User Account"
                          >
                            <UserX className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* --- CATALOG & FRUIT MANAGEMENT TAB --- */
            <div>
              {/* Category Breakdown Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase font-bold">Tree Fruits</p>
                  <p className="text-2xl font-black text-emerald-700">{categoryCounts['Tree Fruits']}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase font-bold">Tropical</p>
                  <p className="text-2xl font-black text-emerald-700">{categoryCounts['Tropical']}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase font-bold">Citrus</p>
                  <p className="text-2xl font-black text-emerald-700">{categoryCounts['Citrus']}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase font-bold">Berries</p>
                  <p className="text-2xl font-black text-emerald-700">{categoryCounts['Berries']}</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600 text-sm font-medium">
                  {userRole === 'admin' ? 'Managing all platform items' : 'Managing your added products'} ({displayedFruits.length} total fruits)
                </p>
                {!isAddingNew && !editingFruit && (
                  <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow transition cursor-pointer text-sm"
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                        placeholder="e.g. Organic Dragonfruit"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Fruit['category'] })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        required
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addFruitMutation.isPending || updateFruitMutation.isPending}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium shadow transition cursor-pointer disabled:opacity-50 text-sm"
                    >
                      <Save className="w-4 h-4" /> 
                      {isAddingNew 
                        ? (addFruitMutation.isPending ? 'Saving...' : 'Save Fruit') 
                        : (updateFruitMutation.isPending ? 'Updating...' : 'Update Changes')}
                    </button>
                  </div>
                </form>
              )}

              {/* Table of Fruits */}
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
                    {displayedFruits.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                          No fruits found in your catalog.
                        </td>
                      </tr>
                    ) : (
                      displayedFruits.map((fruit: Fruit) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};