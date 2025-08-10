'use client';

import { useState } from 'react';
import { 
  PageLoader, 
  SkeletonLoader, 
  ButtonLoader, 
  DataLoader, 
  PageTransition 
} from '@/components';

export default function LoadingDemo() {
  const [pageLoading, setPageLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [transition, setTransition] = useState(false);
  const [dataLoaderType, setDataLoaderType] = useState<'bars' | 'dots' | 'pulse' | 'wave' | 'spinner'>('bars');

  const triggerPageLoader = () => {
    setPageLoading(true);
    setTimeout(() => setPageLoading(false), 3000);
  };

  const triggerButtonLoader = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            🚀 Insane Loading Features
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Enterprise-level loading animations and states
          </p>
        </div>

        {/* Page Loader Demo */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Page Loader</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Full-screen loading with progress, animated particles, and smooth transitions.
          </p>
          <ButtonLoader
            loading={false}
            onClick={triggerPageLoader}
            variant="primary"
            size="lg"
          >
            🎬 Demo Page Loader
          </ButtonLoader>
        </div>

        {/* Button Loaders Demo */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Button Loaders</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Smart buttons with loading states, shimmer effects, and smooth transitions.
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLoader
              loading={buttonLoading}
              onClick={triggerButtonLoader}
              variant="primary"
              size="sm"
            >
              Primary Small
            </ButtonLoader>
            <ButtonLoader
              loading={buttonLoading}
              onClick={triggerButtonLoader}
              variant="secondary"
              size="md"
            >
              Secondary Medium
            </ButtonLoader>
            <ButtonLoader
              loading={buttonLoading}
              onClick={triggerButtonLoader}
              variant="danger"
              size="lg"
            >
              Danger Large
            </ButtonLoader>
          </div>
        </div>

        {/* Data Loaders Demo */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Data Loaders</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Animated loading indicators for different data states.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              {(['bars', 'dots', 'pulse', 'wave', 'spinner'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDataLoaderType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    dataLoaderType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <div className="font-medium">Small</div>
                <DataLoader isLoading={true} type={dataLoaderType} size="sm" />
              </div>
              <div className="space-y-2">
                <div className="font-medium">Medium</div>
                <DataLoader isLoading={true} type={dataLoaderType} size="md" />
              </div>
              <div className="space-y-2">
                <div className="font-medium">Large</div>
                <DataLoader isLoading={true} type={dataLoaderType} size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Loaders Demo */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Skeleton Loaders</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Content placeholders with shimmer effects for better perceived performance.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium">Card Skeleton</h3>
              <SkeletonLoader type="card" count={1} />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">List Skeleton</h3>
              <SkeletonLoader type="list" count={3} />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Analytics Skeleton</h3>
            <SkeletonLoader type="analytics" count={1} />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Room Grid Skeleton</h3>
            <SkeletonLoader type="room-grid" count={6} />
          </div>
        </div>

        {/* Page Transition Demo */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Page Transitions</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Smooth page transitions with multiple animation styles.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['horizontal', 'vertical', 'diagonal', 'radial'].map((direction) => (
              <ButtonLoader
                key={direction}
                loading={false}
                onClick={() => {
                  setTransition(true);
                  setTimeout(() => setTransition(false), 1500);
                }}
                variant="secondary"
                size="md"
                className="w-full"
              >
                {direction.charAt(0).toUpperCase() + direction.slice(1)}
              </ButtonLoader>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-900/20 backdrop-blur-sm p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-300">
            ⚡ Performance Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">60fps</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">Smooth Animations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">~2KB</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">Bundle Size</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">0ms</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">Layout Shift</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Components */}
      <PageLoader isLoading={pageLoading} progress={pageLoading ? 75 : 100} />
      <PageTransition isLoading={transition} direction="horizontal" />
    </div>
  );
}
