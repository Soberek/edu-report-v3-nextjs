/**
 * Shared Components - Barrel Export
 * 
 * This file exports all shared components from ui/, layout/, and shared/ subdirectories.
 * Import components using: import { Button, PageHeader } from '@/components'
 */

// UI Components - Basic primitives
export * from './ui/bottom-navbar';
export * from './ui/breadcrumbs';
export * from './ui/side-drawer';
export * from './ui/top-navbar';

// Layout Components
export * from './layout/AuthenticatedLayout';

// Shared Business Components
export * from './shared/ActionButton';
export * from './shared/AutocompleteField';
export * from './shared/ConfirmDialog';
export * from './shared/DataTable';
export * from './shared/EditDialog';
export * from './shared/EmptyState';
export * from './shared/ErrorBoundary';
export * from './shared/FormField';
export * from './shared/LoadingSpinner';
export * from './shared/PageHeader';
export * from './shared/response-display';
export * from './shared/StatsCard';
export * from './shared/TableCellComponents';
export * from './shared/TabPanel';
export * from './shared/UserTable';

