import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectMixClient } from '@mixcore/sdk-client-ng';

@Directive({
  selector: '[ifRole]',
  standalone: true,
})
export class IfRoleDirective {
  private currentUserRoles: string[] = [];
  private auth = injectMixClient().auth;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {
    this.currentUserRoles = this.auth.getUserRoles() || [];
  }

  @Input() set ifRole(allowedRoles: string[]) {
    this.viewContainer.clear();

    if (!allowedRoles.length || this.hasAccess(allowedRoles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private hasAccess(allowedRoles: string[]): boolean {
    return allowedRoles.some((role) => this.currentUserRoles.includes(role));
  }
}
