import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectMixClient } from '@mixcore/sdk-client-ng';

@Directive({
  selector: '[ifPermission]',
  standalone: true,
})
export class IfPermissionDirective {
  private currentUserPemissions: string[] = [];
  private auth = injectMixClient().auth;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {
    this.currentUserPemissions = this.auth.getUserRoles() || [];
  }

  @Input() set ifRole(allowedRoles: string[]) {
    this.viewContainer.clear();

    if (this.hasAccess(allowedRoles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private hasAccess(allowedRoles: string[]): boolean {
    return allowedRoles.some((role) =>
      this.currentUserPemissions.includes(role),
    );
  }
}
