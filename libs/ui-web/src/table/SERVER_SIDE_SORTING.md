# Server-Side Sorting in Mix Table Component

The Mix Table component now supports server-side sorting for handling large datasets where sorting should be performed on the server rather than the client.

## Features

- **Client-Side Sorting (Default)**: Fast sorting for small to medium datasets
- **Server-Side Sorting**: Efficient sorting for large datasets with server-side processing
- **Automatic Mode Detection**: Seamlessly switches between client and server sorting
- **Consistent API**: Same sorting interface regardless of mode

## Configuration

### Enable Server-Side Sorting

```typescript
<mix-table
  [data]="tableData"
  [serverSide]="true"  // Enable server-side sorting
  [enableSorting]="true"
  [sorting]="currentSorts"
  (onSortChange)="handleServerSortChange($event)"
>
  <!-- Column definitions -->
</mix-table>
```

### Client-Side Sorting (Default)

```typescript
<mix-table
  [data]="tableData"
  [serverSide]="false"  // Default: client-side sorting
  [enableSorting]="true"
  [sorting]="currentSorts"
  (onSortChange)="handleClientSortChange($event)"
>
  <!-- Column definitions -->
</mix-table>
```

## Implementation Example

### Component Setup

```typescript
import { Component, signal } from '@angular/core';
import { ITableSort, ITableSortChange } from '@mixcore/ui/table';

@Component({
  selector: 'app-user-list',
  template: `
    <mix-table [data]="users()" [loading]="loading()" [serverSide]="true" [enableSorting]="true" [sorting]="sorts()" (onSortChange)="onSortChange($event)">
      <mix-table-column key="name" header="Name" />
      <mix-table-column key="email" header="Email" />
      <mix-table-column key="createdAt" header="Created Date" />
    </mix-table>
  `,
})
export class UserListComponent {
  users = signal<User[]>([]);
  loading = signal(false);
  sorts = signal<ITableSort[]>([]);

  constructor(private userService: UserService) {
    this.loadUsers();
  }

  async onSortChange(event: ITableSortChange): Promise<void> {
    this.sorts.set(event.sorts);
    await this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    this.loading.set(true);

    try {
      const params = {
        sorts: this.sorts(), // Send sort parameters to server
        // ... other parameters (pagination, filters, etc.)
      };

      const response = await this.userService.getUsers(params);
      this.users.set(response.data);
    } finally {
      this.loading.set(false);
    }
  }
}
```

### Service Implementation

```typescript
export interface UserQueryParams {
  sorts?: ITableSort[];
  page?: number;
  pageSize?: number;
  filters?: ITableFilterValue[];
}

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  async getUsers(params: UserQueryParams): Promise<ApiResponse<User[]>> {
    // Convert sorting to API format
    const sortParams = params.sorts?.map(sort =>
      \`\${sort.field}:\${sort.direction}\`
    ).join(',');

    const httpParams = new HttpParams({
      fromObject: {
        ...(sortParams && { sort: sortParams }),
        page: params.page?.toString() || '0',
        size: params.pageSize?.toString() || '20',
        // Add filter parameters as needed
      }
    });

    return this.http.get<ApiResponse<User[]>>('/api/users', {
      params: httpParams
    }).toPromise();
  }
}
```

## API Contract

### Sort Request Format

The component emits sort changes in this format:

```typescript
interface ITableSortChange {
  sorts: ITableSort[];
}

interface ITableSort {
  field: string; // Column field name
  direction: 'asc' | 'desc'; // Sort direction
}
```

### Example Sort Event

```typescript
{
  sorts: [
    { field: 'name', direction: 'asc' },
    { field: 'createdAt', direction: 'desc' },
  ];
}
```

## Server Implementation Example

### ASP.NET Core

```csharp
[HttpGet]
public async Task<IActionResult> GetUsers(
    [FromQuery] string? sort,
    [FromQuery] int page = 0,
    [FromQuery] int size = 20)
{
    var query = _context.Users.AsQueryable();

    // Apply sorting
    if (!string.IsNullOrEmpty(sort))
    {
        var sortParts = sort.Split(',');
        foreach (var sortPart in sortParts)
        {
            var parts = sortPart.Split(':');
            if (parts.Length == 2)
            {
                var field = parts[0];
                var direction = parts[1];

                query = direction.ToLower() == "desc"
                    ? query.OrderByDescending(GetPropertyExpression(field))
                    : query.OrderBy(GetPropertyExpression(field));
            }
        }
    }

    var users = await query
        .Skip(page * size)
        .Take(size)
        .ToListAsync();

    return Ok(new { data = users, total = await query.CountAsync() });
}
```

### Node.js/Express

```javascript
app.get('/api/users', async (req, res) => {
  const { sort, page = 0, size = 20 } = req.query;

  let query = User.find();

  // Apply sorting
  if (sort) {
    const sortObj = {};
    sort.split(',').forEach((sortPart) => {
      const [field, direction] = sortPart.split(':');
      sortObj[field] = direction === 'desc' ? -1 : 1;
    });
    query = query.sort(sortObj);
  }

  const users = await query
    .skip(page * size)
    .limit(size)
    .exec();

  const total = await User.countDocuments();

  res.json({ data: users, total });
});
```

## Key Differences

### Client-Side Sorting

- ✅ Fast for small datasets (< 1000 rows)
- ✅ No server requests on sort
- ❌ Memory intensive for large datasets
- ❌ All data must be loaded initially

### Server-Side Sorting

- ✅ Efficient for large datasets (1000+ rows)
- ✅ Memory efficient - only current page in memory
- ✅ Can sort across entire dataset without loading all data
- ❌ Requires server request on each sort change
- ❌ Slightly slower for small datasets

## Best Practices

1. **Use server-side sorting when:**
   - Dataset has 1000+ rows
   - Memory usage is a concern
   - Data is paginated
   - Real-time data updates are frequent

2. **Use client-side sorting when:**
   - Dataset has < 1000 rows
   - Fast sorting response is critical
   - Data doesn't change frequently
   - Offline functionality is needed

3. **Always provide loading states** when using server-side sorting

4. **Combine with pagination** for optimal performance

5. **Handle errors gracefully** and provide fallback sorting options
