import React, { useState, useEffect } from 'react';
import { Category, Tag } from '../types';

interface CategoryTagSelectorProps {
  roomId: number;
  selectedCategoryId?: number;
  selectedTagIds: number[];
  onCategoryChange: (categoryId?: number) => void;
  onTagsChange: (tagIds: number[]) => void;
}

export const CategoryTagSelector: React.FC<CategoryTagSelectorProps> = ({
  roomId,
  selectedCategoryId,
  selectedTagIds,
  onCategoryChange,
  onTagsChange
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch(`/api/rooms/${roomId}/categories`, { credentials: 'include' }),
          fetch(`/api/rooms/${roomId}/tags`, { credentials: 'include' })
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Failed to load categories/tags:', error);
      }
    };

    loadData();
  }, [roomId]);

  const handleTagToggle = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newTagName.trim() })
      });

      if (response.ok) {
        const newTag = await response.json();
        setTags([...tags, newTag]);
        onTagsChange([...selectedTagIds, newTag.id]);
        setNewTagName('');
        setIsCreatingTag(false);
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {/* No Category Option */}
          <button
            type="button"
            onClick={() => onCategoryChange(undefined)}
            className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
              !selectedCategoryId
                ? 'border-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
            }`}
          >
            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              No Category
            </div>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedCategoryId === category.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
              style={{ borderColor: selectedCategoryId === category.id ? category.color : undefined }}
            >
              <div className="flex items-center gap-2 mb-1">
                {category.icon && <span className="text-lg">{category.icon}</span>}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {category.name}
              </div>
              {category._count && (
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {category._count.bills} bills
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedTagIds.includes(tag.id)
                  ? 'border-transparent text-white'
                  : 'border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
              style={{
                backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : undefined,
                borderColor: selectedTagIds.includes(tag.id) ? tag.color : undefined
              }}
            >
              {tag.name}
              {tag._count && (
                <span className="ml-1 opacity-70">({tag._count.billTags})</span>
              )}
            </button>
          ))}

          {/* Create New Tag */}
          {isCreatingTag ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateTag();
                  } else if (e.key === 'Escape') {
                    setIsCreatingTag(false);
                    setNewTagName('');
                  }
                }}
                placeholder="Tag name"
                className="px-3 py-1.5 text-sm rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCreateTag}
                className="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingTag(false);
                  setNewTagName('');
                }}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreatingTag(true)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200"
            >
              + Add Tag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
