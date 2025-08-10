'use client';

interface MinimalLoaderProps {
  isLoading: boolean;
}

export default function MinimalLoader({ isLoading }: MinimalLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin-fast rounded-full"></div>
    </div>
  );
}
