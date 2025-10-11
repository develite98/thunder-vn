# Column Visibility Feature

The table component now supports column visibility management through a dropdown interface.

## Features

- **Column Toggle**: Show/hide individual columns
- **Bulk Actions**: Show All / Hide All columns
- **Visual Indicator**: Dropdown with checkbox interface
- **Persistent State**: Column visibility state is managed through signals

## Usage

### Basic Implementation

```typescript
import { Component, signal } from '@angular/core';
import { IColumnVisibility, IColumnVisibilityChange } from '@mixcore/ui/table';

@Component({
  selector: 'app-example',
  template: `
    <mix-table [data]="tableData()" [columnVisibility]="columnVisibility()" (onColumnVisibilityChange)="handleColumnVisibilityChange($event)">
      <mix-table-column key="id" header="ID" />
      <mix-table-column key="name" header="Name" />
      <mix-table-column key="email" header="Email" />
      <mix-table-column key="status" header="Status" />
    </mix-table>
  `,
})
export class ExampleComponent {
  public tableData = signal([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  ]);

  public columnVisibility = signal<IColumnVisibility>({
    id: true,
    name: true,
    email: true,
    status: false, // Initially hidden
  });

  handleColumnVisibilityChange(event: IColumnVisibilityChange): void {
    this.columnVisibility.set(event.columnVisibility);
    console.log('Column visibility changed:', event.columnVisibility);
  }
}
```

### Advanced Usage with Server-Side State

```typescript
@Component({
  selector: 'app-advanced-example',
  template: `
    <mix-table [data]="tableData()" [columnVisibility]="columnVisibility()" (onColumnVisibilityChange)="handleColumnVisibilityChange($event)">
      <!-- Column definitions -->
    </mix-table>
  `,
})
export class AdvancedExampleComponent {
  private readonly userPreferencesService = inject(UserPreferencesService);

  public columnVisibility = signal<IColumnVisibility>({});

  ngOnInit() {
    // Load saved column preferences
    this.loadColumnPreferences();
  }

  handleColumnVisibilityChange(event: IColumnVisibilityChange): void {
    this.columnVisibility.set(event.columnVisibility);

    // Save preferences to server/localStorage
    this.userPreferencesService.saveColumnVisibility('user-table', event.columnVisibility);
  }

  private loadColumnPreferences(): void {
    const savedPreferences = this.userPreferencesService.getColumnVisibility('user-table');
    if (savedPreferences) {
      this.columnVisibility.set(savedPreferences);
    }
  }
}
```

## API Reference

### IColumnVisibility

```typescript
interface IColumnVisibility {
  [columnId: string]: boolean;
}
```

### IColumnVisibilityChange

```typescript
interface IColumnVisibilityChange {
  columnVisibility: IColumnVisibility;
}
```

### Table Component Inputs/Outputs

**New Inputs:**

- `columnVisibility: IColumnVisibility` - Controls which columns are visible

**New Outputs:**

- `onColumnVisibilityChange: IColumnVisibilityChange` - Emitted when column visibility changes

## Column Visibility Dropdown Component

The dropdown automatically appears in table view mode and provides:

1. **Individual Column Toggles**: Checkbox for each column
2. **Bulk Actions**: "Show All" and "Hide All" buttons
3. **Column Labels**: Uses column headers or keys as display names
4. **Disabled State**: Support for columns that cannot be hidden

## Implementation Details

### Component Structure

```
mix-table
├── toolbar
│   ├── filters
│   ├── search
│   ├── column-visibility (NEW)
│   └── view-mode-tabs
└── table-content
```

### State Management

- Column visibility is managed through Angular signals
- Changes are reactive and immediately update the table
- Parent components can control and respond to visibility changes

## Benefits

1. **User Experience**: Users can customize table views to their needs
2. **Performance**: Hidden columns are not rendered, improving performance
3. **Responsive**: Useful for mobile/tablet views with limited space
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Integration**: Seamlessly integrates with existing table features (sorting, filtering, etc.)
