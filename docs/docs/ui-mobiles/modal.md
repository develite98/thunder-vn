---
sidebar_position: 1
---

# Modal

Confirmation modal specific for mobile behavior

## Import

```ts
import { injectModalService } from '@mixcore/ui-mobile/modal';
```

## Usage

```ts
import { Component } from '@angular/core';
import { injectModalService } from '@mixcore/ui-mobile/modal';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.page.html',
})
export class DemoPageComponent {
  public modal = injectModalService();

  public deleteData() {
    this.modal.asKForAction(
      'Do you want to delete this data',
      () => {
        // Handle if user click ok
      },
      // Optional
      () => {
        // Handle if user click cancel
      },
    );
  }
}
```

## Customization
