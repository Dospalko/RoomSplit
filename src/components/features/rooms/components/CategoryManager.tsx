import React, { useState, useEffect } from 'react';
import { Category } from '../types';

interface CategoryManagerProps {
  roomId: number;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ roomId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: ''
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/categories`, {
          credentials: 'include'
        });
        if (response.ok) {
          const categoriesData = await response.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [roomId]);

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description.trim() || undefined,
          color: newCategory.color,
          icon: newCategory.icon.trim() || undefined
        })
      });

      if (response.ok) {
        const createdCategory = await response.json();
        setCategories([...categories, createdCategory]);
        setNewCategory({ name: '', description: '', color: '#3B82F6', icon: '' });
        setIsCreating(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category');
    }
  };

  const handleSeedDefaultCategories = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/categories/seed`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Reload categories
        const categoriesResponse = await fetch(`/api/rooms/${roomId}/categories`, {
          credentials: 'include'
        });
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create default categories');
      }
    } catch (error) {
      console.error('Failed to seed categories:', error);
      alert('Failed to create default categories');
    }
  };

  const predefinedColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280'
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Categories
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
        >
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
          >
            <div className="flex items-center gap-3 mb-2">
              {category.icon && <span className="text-lg">{category.icon}</span>}
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {category.name}
              </span>
            </div>
            {category.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                {category.description}
              </p>
            )}
            {category._count && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {category._count.bills} bills
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No categories message with seed button */}
      {categories.length === 0 && (
        <div className="text-center py-8">
          <div className="text-neutral-500 dark:text-neutral-400 mb-4">
            No categories created yet
          </div>
          <button
            onClick={handleSeedDefaultCategories}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200 border border-blue-200 dark:border-blue-800"
          >
            Create Default Categories
          </button>
        </div>
      )}

      {/* Create New Category Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Create New Category
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Food & Dining"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Groceries, restaurants, takeout"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Icon (optional)
                </label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🍽️"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        newCategory.color === color 
                          ? 'border-neutral-900 dark:border-neutral-100 scale-110' 
                          : 'border-neutral-300 dark:border-neutral-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateCategory}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewCategory({ name: '', description: '', color: '#3B82F6', icon: '' });
                }}
                className="flex-1 py-2 px-4 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
