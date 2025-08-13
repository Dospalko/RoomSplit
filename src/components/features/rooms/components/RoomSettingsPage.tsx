import React from 'react';
import { CategoryManager, TagManager } from '../components';

interface RoomSettingsPageProps {
  roomId: number;
}

export const RoomSettingsPage: React.FC<RoomSettingsPageProps> = ({ roomId }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Room Settings
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage categories and tags for better expense organization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryManager roomId={roomId} />
        <TagManager roomId={roomId} />
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
            i
          </div>
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Categories vs Tags
            </h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p>
                <strong>Categories:</strong> Use for major expense types (Food, Utilities, Rent). 
                Each bill can have one category. Categories help with budgeting and expense tracking.
              </p>
              <p>
                <strong>Tags:</strong> Use for additional descriptors (urgent, shared, personal). 
                Bills can have multiple tags. Tags help with filtering and organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
