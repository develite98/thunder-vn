# Table Component with Sorting

The `MixTableComponent` now includes sorting functionality powered by TanStack Table. It supports both **client-side** and **server-side** sorting modes.

## Sorting Modes

### Client-Side Sorting (Default)

Fast sorting for small to medium datasets where all data is loaded in the browser.

### Server-Side Sorting

Efficient sorting for large datasets where sorting is performed on the server. See [SERVER_SIDE_SORTING.md](./SERVER_SIDE_SORTING.md) for detailed documentation.

## Basic Usage with Client-Side Sorting

```typescript
import { Component, signal } from '@angular/core';
import { ITableSort, ITableSortChange } from '@mixcore/ui/table';

@Component({
  template: `
    <mix-table [data]="tableData()" [enableSorting]="true" [sorting]="currentSorting()" (onSortChange)="handleSortChange($event)">
      <mix-table-column key="name" header="common.name" />
      <mix-table-column key="email" header="common.email" />
      <mix-table-column key="status" header="common.status" />
      <mix-table-column key="createdAt" header="common.createdDate" />
    </mix-table>
  `,
})
export class MyTableComponent {
  tableData = signal([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', createdAt: '2024-01-02' },
    // ... more data
  ]);

  currentSorting = signal<ITableSort[]>([{ field: 'name', direction: 'asc' }]);

  handleSortChange(event: ITableSortChange) {
    this.currentSorting.set(event.sorts);
    // Handle sorting logic here (e.g., API call with sort parameters)
    console.log('Sort changed:', event.sorts);
  }
}
```

## Server-Side Sorting Example

```typescript
@Component({
  template: `
    <mix-table [data]="tableData()" [serverSide]="true" [enableSorting]="true" [sorting]="currentSorting()" [loading]="loading()" (onSortChange)="handleServerSortChange($event)">
      <mix-table-column key="name" header="common.name" />
      <mix-table-column key="email" header="common.email" />
      <mix-table-column key="status" header="common.status" />
    </mix-table>
  `,
})
export class ServerSortTableComponent {
  tableData = signal([]);
  currentSorting = signal<ITableSort[]>([]);
  loading = signal(false);

  async handleServerSortChange(event: ITableSortChange) {
    this.currentSorting.set(event.sorts);
    this.loading.set(true);

    try {
      // Call API with sort parameters
      const data = await this.apiService.getData({
        sorts: event.sorts,
        // ... other parameters
      });
      this.tableData.set(data);
    } finally {
      this.loading.set(false);
    }
  }
}
```

For complete server-side sorting documentation, see [SERVER_SIDE_SORTING.md](./SERVER_SIDE_SORTING.md).

## Component Inputs

| Input           | Type           | Default | Description                          |
| --------------- | -------------- | ------- | ------------------------------------ |
| `enableSorting` | `boolean`      | `true`  | Enable/disable sorting functionality |
| `serverSide`    | `boolean`      | `false` | Enable server-side sorting mode      |
| `sorting`       | `ITableSort[]` | `[]`    | Current sorting state                |

## Component Outputs

| Output         | Type               | Description                  |
| -------------- | ------------------ | ---------------------------- |
| `onSortChange` | `ITableSortChange` | Emitted when sorting changes |

## Types

```typescript
interface ITableSort {
  field: string;
  direction: 'asc' | 'desc';
}

interface ITableSortChange {
  sorts: ITableSort[];
}
```

## Features

- **Visual Indicators**: Sort direction is shown with chevron icons
- **Multi-column Sorting**: Hold Shift and click to sort by multiple columns
- **Keyboard Accessible**: Fully keyboard navigable
- **Customizable**: Can disable sorting per column or globally

## Styling

The sort component uses these CSS classes:

- `cursor-pointer` - Clickable cursor on sortable headers
- `text-primary` - Active sort indicator color
- `text-base-content/40` - Inactive sort indicator color

## Column Configuration

Individual columns can control their sorting behavior:

```typescript
// In your column directive, sorting is enabled by default if enableSorting is true
// Selection and action columns automatically have sorting disabled
```

## Server-side Sorting

For server-side sorting, handle the `onSortChange` event:

```typescript
handleSortChange(event: ITableSortChange) {
  const sortParams = event.sorts.map(sort => ({
    field: sort.field,
    order: sort.direction
  }));

  // Call your API with sort parameters
  this.loadData(sortParams);
}
```

## Integration with Existing Features

The sorting functionality works seamlessly with:

- Pagination
- Filtering
- Search
- Context menus
- Row selection
- View modes (table/card)

The component maintains optimal performance through:

- Computed signals for reactive updates
- TrackBy functions for efficient DOM updates
- OnPush change detection strategy
- Readonly event handlers to prevent function recreation
