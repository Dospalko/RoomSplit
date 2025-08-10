// Components - Main Barrel Export
// 🎯 Enterprise-Level Component Architecture
// Organized by domain and responsibility for maximum maintainability

// Layout Components
export * from './layout';

// Feature Components
export * from './features';

// UI Components
export * from './ui';

// Section Components
export * from './sections';

// Re-exports for backward compatibility and convenience
export { Header, SimpleHeader, ConditionalHeader, Footer } from './layout';
export { ExpenseAnalytics, RoomGrid } from './features';
export { RoomCreateModal, PageLoader, SkeletonLoader, ButtonLoader, DataLoader, PageTransition } from './ui';
export { Hero, FeaturesSection, HowItWorksSection, StatsSection } from './sections';
