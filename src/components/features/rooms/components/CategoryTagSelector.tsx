import React, { useState, useEffect, useRef } from 'react';
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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch(`/api/rooms/${roomId}/categories`, { credentials: 'include' }),
          fetch(`/api/rooms/${roomId}/tags`, { credentials: 'include' })
        ]);

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }

        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Failed to load categories and tags:', error);
      }
    };

    loadData();
  }, [roomId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setTagDropdownOpen(false);
        setIsCreatingTag(false);
        setNewTagName('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  const selectedTagsData = tags.filter(tag => selectedTagIds.includes(tag.id));

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
        body: JSON.stringify({
          name: newTagName.trim(),
          color: '#6B7280'
        })
      });

      if (response.ok) {
        const newTag = await response.json();
        setTags([...tags, newTag]);
        onTagsChange([...selectedTagIds, newTag.id]);
        setNewTagName('');
        setIsCreatingTag(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create tag');
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert('Failed to create tag');
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Category
        </label>
        <div className="relative" ref={categoryDropdownRef}>
          <button
            type="button"
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl text-left text-neutral-900 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {selectedCategory ? (
              <div className="flex items-center gap-3">
                {selectedCategory.icon && (
                  <span className="text-lg">{selectedCategory.icon}</span>
                )}
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <span className="font-medium">{selectedCategory.name}</span>
              </div>
            ) : (
              <span className="text-neutral-500 dark:text-neutral-400">Select a category</span>
            )}
            <svg
              className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
                categoryDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {categoryDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg max-h-60 overflow-y-auto overscroll-contain dropdown-scroll">
              {/* Clear selection option */}
              <button
                type="button"
                onClick={() => {
                  onCategoryChange(undefined);
                  setCategoryDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span>No category</span>
              </button>
              
              {categories.length === 0 ? (
                <div className="px-4 py-6 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                  No categories available
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      onCategoryChange(category.id);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${
                      selectedCategoryId === category.id
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                        : 'text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {category.icon && (
                      <span className="text-lg w-6 text-center">{category.icon}</span>
                    )}
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{category.name}</div>
                      {category.description && (
                        <div className="text-xs opacity-70 truncate">{category.description}</div>
                      )}
                    </div>
                    {selectedCategoryId === category.id && (
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Tags
        </label>
        <div className="relative" ref={tagDropdownRef}>
          <button
            type="button"
            onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-xl text-left text-neutral-900 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              {selectedTagsData.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedTagsData.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs rounded-md"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </span>
                  ))}
                  {selectedTagsData.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs rounded-md">
                      +{selectedTagsData.length - 3} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-neutral-500 dark:text-neutral-400">Select tags</span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ml-2 flex-shrink-0 ${
                tagDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {tagDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg max-h-60 overflow-y-auto overscroll-contain dropdown-scroll">
              {/* Create new tag option */}
              <div className="border-b border-neutral-200 dark:border-neutral-700">
                {isCreatingTag ? (
                  <div className="p-3 space-y-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                      className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateTag();
                        } else if (e.key === 'Escape') {
                          setIsCreatingTag(false);
                          setNewTagName('');
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCreateTag}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingTag(false);
                          setNewTagName('');
                        }}
                        className="px-3 py-1 text-xs bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-500 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCreatingTag(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium">Create new tag</span>
                  </button>
                )}
              </div>

              {/* Existing tags */}
              {tags.length === 0 ? (
                <div className="px-4 py-6 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                  No tags available
                </div>
              ) : (
                <div className="p-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                        selectedTagIds.includes(tag.id)
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                          : 'text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="flex-1 font-medium">{tag.name}</span>
                      {selectedTagIds.includes(tag.id) && (
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
