import { CdkPortalOutlet } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BreadcrumbsService } from './breadcrumbs.service';

@Component({
  selector: 'mix-breadcrumbs-outlet',
  standalone: true,
  imports: [AsyncPipe, CdkPortalOutlet],
  template: `
    @if (breadcrumbService.templatePortal$ | async; as breadcrumbs) {
      @for (breadcrumb of breadcrumbs; track breadcrumb; let last = $last) {
        @if (last) {
          <ng-template [cdkPortalOutlet]="breadcrumb.template"></ng-template>
        }
      }
    }
  `,
})
export class BreadcrumbsOutletComponent {
  public breadcrumbService = inject(BreadcrumbsService);
}
