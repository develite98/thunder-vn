import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TemplatePortalItem {
  template: TemplatePortal;
  id: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbsService {
  public templatePortal$ = new BehaviorSubject<TemplatePortalItem[]>([]);

  public add(
    id: string,
    template: TemplateRef<unknown>,
    viewRef: ViewContainerRef,
  ) {
    const existingPortals = this.templatePortal$.getValue();
    const newPortal = {
      id: id,
      template: new TemplatePortal(template, viewRef),
    };
    const updatedPortals = [...existingPortals, newPortal];

    this.templatePortal$.next(updatedPortals);
  }

  public refresh() {
    const currentPortals = this.templatePortal$.getValue();
    const updatedPortals = currentPortals.map((item) => ({
      ...item,
      template: new TemplatePortal(
        item.template.templateRef,
        item.template.viewContainerRef,
      ),
    }));

    this.templatePortal$.next(updatedPortals);
  }

  public remove(id: string) {
    const existingPortals = this.templatePortal$.getValue();
    const updatedPortals = existingPortals.filter((portal) => portal.id !== id);

    this.templatePortal$.next(updatedPortals);
  }
}
