# Shared Components Guide

This guide shows how to use the newly created generic shared components to replace feature-specific implementations.

## 🎯 **New Generic Components**

### 1. **FilterSection** - Generic Filter Component

Replaces multiple filter implementations across features with a unified, flexible component.

#### **Before (Feature-specific):**
```tsx
// Multiple different filter components across features
// - src/features/schools/components/SchoolFilter.tsx
// - src/features/schedule/components/FilterSection.tsx
// - src/features/contacts/components/search.tsx
// - src/features/programy-edukacyjne/components/ProgramFilter.tsx
```

#### **After (Generic):**
```tsx
import { FilterSection, createFilterFields } from "@/components/shared";

// Example usage in any feature
const MyFilterComponent = () => {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    city: "",
    status: []
  });

  const fields = [
    createFilterFields.search(
      filters.search,
      (value) => setFilters(prev => ({ ...prev, search: value })),
      "Szukaj szkół..."
    ),
    createFilterFields.select(
      "type",
      "Typ szkoły",
      filters.type,
      (value) => setFilters(prev => ({ ...prev, type: value })),
      ["Podstawowa", "Średnia", "Zawodowa"]
    ),
    createFilterFields.multiselect(
      "status",
      "Status",
      filters.status,
      (value) => setFilters(prev => ({ ...prev, status: value })),
      ["Aktywna", "Nieaktywna", "W trakcie"]
    )
  ];

  return (
    <FilterSection
      title="Filtry szkół"
      fields={fields}
      onClearAll={() => setFilters({ search: "", type: "", city: "", status: [] })}
    />
  );
};
```

### 2. **GenericDialog** - Universal Dialog Component

Replaces multiple dialog implementations with a consistent, feature-rich dialog.

#### **Before (Feature-specific):**
```tsx
// Multiple dialog components across features
// - src/features/contacts/components/edit-dialog.tsx
// - src/features/holidays/components/TemplateConfigDialog.tsx
// - src/features/schedule/components/form.tsx (contains dialog logic)
```

#### **After (Generic):**
```tsx
import { GenericDialog, FormDialog, ConfirmDialog } from "@/components/shared";

// Form Dialog
const EditContactDialog = ({ open, onClose, onSave, contact }) => (
  <FormDialog
    open={open}
    onClose={onClose}
    onSave={onSave}
    title="Edytuj kontakt"
    subtitle={`${contact.firstName} ${contact.lastName}`}
    loading={isLoading}
  >
    <ContactForm contact={contact} />
  </FormDialog>
);

// Confirm Dialog
const DeleteConfirmDialog = ({ open, onClose, onConfirm, itemName }) => (
  <ConfirmDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Potwierdź usunięcie"
    message={`Czy na pewno chcesz usunąć ${itemName}?`}
    confirmText="Usuń"
    cancelText="Anuluj"
  />
);

// Custom Dialog
const CustomDialog = ({ open, onClose }) => (
  <GenericDialog
    open={open}
    onClose={onClose}
    title="Niestandardowy dialog"
    maxWidth="lg"
    showSave={false}
    showCancel={true}
  >
    <CustomContent />
  </GenericDialog>
);
```

### 3. **Enhanced FormField** - Already Comprehensive

The existing FormField component is already very comprehensive and supports:
- Text, email, password, number inputs
- Textarea with configurable rows
- Select dropdowns with options
- Checkbox and radio groups
- Date picker with Polish localization
- Full validation support with Polish error messages

## 🔄 **Migration Examples**

### **Schools Filter Migration**

#### **Before:**
```tsx
// src/features/schools/components/SchoolFilter.tsx
export const SchoolFilter: React.FC<SchoolFilterProps> = ({ 
  filter, 
  onFilterChange, 
  uniqueTypes, 
  uniqueCities 
}) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <FilterList sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6">Filtry</Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 2 }}>
        <TextField
          label="Szukaj"
          value={filter.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          // ... more props
        />
        {/* More filter fields */}
      </Box>
    </Paper>
  );
};
```

#### **After:**
```tsx
// src/features/schools/components/SchoolFilter.tsx
import { FilterSection, createFilterFields } from "@/components/shared";

export const SchoolFilter: React.FC<SchoolFilterProps> = ({ 
  filter, 
  onFilterChange, 
  uniqueTypes, 
  uniqueCities 
}) => {
  const fields = [
    createFilterFields.search(
      filter.search,
      (value) => onFilterChange({ search: value }),
      "Szukaj szkół..."
    ),
    createFilterFields.multiselect(
      "type",
      "Typ szkoły",
      filter.type,
      (value) => onFilterChange({ type: value }),
      uniqueTypes
    ),
    createFilterFields.autocomplete(
      "city",
      "Miasto",
      filter.city,
      (value) => onFilterChange({ city: value }),
      uniqueCities
    )
  ];

  return (
    <FilterSection
      title="Filtry szkół"
      fields={fields}
      onClearAll={() => onFilterChange({ search: "", type: [], city: "" })}
    />
  );
};
```

### **Contact Edit Dialog Migration**

#### **Before:**
```tsx
// src/features/contacts/components/edit-dialog.tsx
export default function EditDialog({ open, contact, onClose, onSave, loading }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          // ... more styling
        },
      }}
    >
      <DialogTitle sx={{ /* complex styling */ }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar>{/* avatar content */}</Avatar>
          <Box>
            <Typography variant="h5">Edytuj kontakt</Typography>
            <Typography variant="body2">{contact.firstName} {contact.lastName}</Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>{/* form content */}</DialogContent>
      <DialogActions>{/* action buttons */}</DialogActions>
    </Dialog>
  );
}
```

#### **After:**
```tsx
// src/features/contacts/components/edit-dialog.tsx
import { FormDialog } from "@/components/shared";

export default function EditDialog({ open, contact, onClose, onSave, loading }) {
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSave={onSave}
      title="Edytuj kontakt"
      subtitle={`${contact.firstName} ${contact.lastName}`}
      loading={loading}
      maxWidth="md"
    >
      <ContactForm contact={contact} />
    </FormDialog>
  );
}
```

## 📋 **Benefits of the New Approach**

### **1. Consistency**
- All filters look and behave the same way
- All dialogs have consistent styling and behavior
- Unified user experience across features

### **2. Maintainability**
- Single source of truth for common UI patterns
- Bug fixes and improvements benefit all features
- Easier to maintain and update

### **3. Developer Experience**
- Less code duplication
- Faster development with pre-built components
- Type-safe with full TypeScript support

### **4. Performance**
- Smaller bundle size (no duplicate components)
- Better tree-shaking
- Optimized re-renders

## 🚀 **Next Steps**

1. **Gradually migrate existing features** to use the new generic components
2. **Remove old feature-specific components** once migration is complete
3. **Update documentation** to reflect the new patterns
4. **Train team members** on the new component usage

## 📚 **Component API Reference**

### **FilterSection Props**
```tsx
interface FilterSectionProps {
  title?: string;                    // Default: "Filtry"
  fields: FilterField[];            // Array of filter field configurations
  onClearAll?: () => void;          // Clear all filters callback
  showClearAll?: boolean;           // Default: true
  sx?: object;                      // Custom styling
}
```

### **GenericDialog Props**
```tsx
interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  loading?: boolean;
  saveText?: string;
  cancelText?: string;
  showSave?: boolean;
  showCancel?: boolean;
  saveDisabled?: boolean;
  sx?: object;
}
```

This refactoring significantly improves code maintainability, consistency, and developer experience while reducing bundle size and eliminating duplication.
