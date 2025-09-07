import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';

@Component({
  selector: 'mix-user-profile-dropdown',
  imports: [MixIconComponent],
  templateUrl: './user-profile-dropdown.html',
  styleUrl: './user-profile-dropdown.css',
})
export class UserProfileDropdownComponent {
  public router = inject(Router);
  public client = injectMixClient();
  public user = this.client.auth.currentUser;
  public modal = injectModalService();

  public onLogOut() {
    this.modal.asKForAction('Are you sure to logout', () => {
      this.client.auth.logout(() => {
        this.router.navigate(['/auth/login']);
      });
    });
  }
}
