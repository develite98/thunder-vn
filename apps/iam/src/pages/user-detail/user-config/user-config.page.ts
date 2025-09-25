import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectParams } from '@mixcore/router';
import { IUser } from '@mixcore/sdk-client';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastService } from '@mixcore/ui/toast';
import { UserStore } from 'apps/iam/src/state';

@Component({
  selector: 'mix-iam-user-config-page',
  templateUrl: './user-config.page.html',
  imports: [
    MixFormComponent,
    MixDeleteComponent,
    MixTileComponent,
    MixIconComponent,
    DatePipe,
    TranslocoPipe,
  ],
})
export class IamUserConfigPageComponent {
  readonly modal = injectModalService();
  readonly useId = injectParams('userId');
  readonly store = inject(UserStore);
  readonly router = injectMiniAppRouter();
  readonly toast = injectToastService();

  public user = this.store.selectEntityById(this.useId);

  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'id',
      type: 'input',
      props: {
        label: 'common.label.id',
        placeholder: 'common.input.placeholder',
        description: '',
        required: true,
        readonly: true,
      },
    },
    {
      key: 'userName',
      type: 'input',
      props: {
        label: 'common.label.username',
        placeholder: 'common.input.placeholder',
        description: '',
        required: true,
        readonly: true,
      },
    },
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'common.label.email',
        placeholder: 'common.input.placeholder',
        description: '',
        type: 'email',
        required: true,
      },
    },
  ];

  public onDelete() {
    this.modal.asKForAction('Are you sure to remove this data', () => {
      const userId = this.useId();
      if (!userId) return;

      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to delete user...',
      );

      this.store
        .deleteDataById(userId, {
          success: () => {
            toastSuccess('User deleted successfully');
            this.router.navigate(['users']);
          },
          error: (error) => {
            toastError('Error deleting user');
            console.error('Error deleting user:', error);
          },
        })
        .subscribe();
    });
  }

  public onSubmit(event: IFormSubmit<IUser>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      'Trying to update user...',
    );

    this.store
      .updateData(event.value, {
        success: () => {
          toastSuccess('User updated successfully');
          event.resetControl?.();
        },
        error: (error) => {
          toastError('Error updating agency');
          console.error('Error updating user:', error);
        },
      })
      .subscribe();
  }
}
