import React, { useState, useEffect } from 'react';
import { Tag } from '../types';

interface TagManagerProps {
  roomId: number;
}

export const TagManager: React.FC<TagManagerProps> = ({ roomId }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTag, setNewTag] = useState({
    name: '',
    color: '#3B82F6'
  });

  // Load tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/tags`, {
          credentials: 'include'
        });
        if (response.ok) {
          const tagsData = await response.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Failed to load tags:', error);
      }
    };

    loadTags();
  }, [roomId]);

  const handleCreateTag = async () => {
    if (!newTag.name.trim()) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newTag.name.trim(),
          color: newTag.color
        })
      });

      if (response.ok) {
        const createdTag = await response.json();
        setTags([...tags, createdTag]);
        setNewTag({ name: '', color: '#3B82F6' });
        setIsCreating(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create tag');
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert('Failed to create tag');
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (!confirm('Are you sure you want to delete this tag? This will remove it from all bills.')) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${roomId}/tags?tagId=${tagId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setTags(tags.filter(tag => tag.id !== tagId));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete tag');
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
      alert('Failed to delete tag');
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
          Tags
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
        >
          Add Tag
        </button>
      </div>

      {/* Tags List */}
      <div className="space-y-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="group flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {tag.name}
              </span>
              {tag._count && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded-md">
                  {tag._count.billTags} bills
                </span>
              )}
            </div>
            <button
              onClick={() => handleDeleteTag(tag.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200"
              title="Delete tag"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        
        {tags.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm italic">
            No tags created yet
          </div>
        )}
      </div>

      {/* Create New Tag Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Create New Tag
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="urgent"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
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
                      onClick={() => setNewTag({ ...newTag, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        newTag.color === color 
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
                onClick={handleCreateTag}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewTag({ name: '', color: '#3B82F6' });
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
