import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { MixQuery } from '@mixcore/sdk-client';
import {
  IBmsUser,
  IBmsUserData,
  IBranchMemberRelation,
  ICreateBranchMemberRequest,
} from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { DialogRef } from '@ngneat/dialog';
import { BmsUserDataStore, BranchMemberStore } from '../../state';

@Component({
  selector: 'mix-create-store-member-form',
  templateUrl: './create-store-member-form.component.html',
  standalone: true,
  imports: [
    MixDialogWrapperComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    MixButtonComponent,
  ],
  providers: [BmsUserDataStore],
})
export class CreateStoreMemberFormComponent extends BaseComponent {
  readonly dialogRef = inject(DialogRef);

  public bmsUserDataStore = inject(BmsUserDataStore);
  public branchMemerStore = inject(BranchMemberStore);

  public username = new FormControl('');
  public userData = signal<IBmsUserData | null>(null);
  public userDataForm = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });

  onSearch() {
    if (!this.username.value) return;

    this.loadingState.set(LoadingState.Loading);
    this.bmsUserDataStore
      .search(
        new MixQuery()
          .default(1)
          .equal('username', this.username.value?.trim()),
        undefined,
        {
          success: (result) => {
            const item = result.items[0] || null;
            this.userData.set(item);
            this.userDataForm.patchValue({
              username: item?.username || this.username.value,
              firstName: item?.firstName || '',
              lastName: item?.lastName || '',
            });

            this.loadingState.set(LoadingState.Success);
          },
          error: () => {
            this.loadingState.set(LoadingState.Error);
          },
        },
      )
      .subscribe();
  }

  onSubmit() {
    const userData = this.userData();
    if (userData) {
      const value: Partial<ICreateBranchMemberRequest> = {
        childDatabaseName: 'bms_user_data',
        childId: userData.id as number,
        parentDatabaseName: 'bms_branch',
        parentId: this.dialogRef.data.branchId,

        userData: {
          id: userData.id,
          displayName: userData.display_name,
          staffCode: userData.staff_code,
          isAvailable: true,
          createdAt: new Date(),
        } as unknown as IBmsUser,
      };

      this.branchMemerStore
        .createData(value as ICreateBranchMemberRequest, {
          success: (result: IBranchMemberRelation) => {
            this.dialogRef.close(result);
          },
          error: () => {
            this.loadingState.set(LoadingState.Error);
          },
        })
        .subscribe();

      return;
    }

    if (FormUtils.validateForm(this.userDataForm)) {
      const formValue = {
        ...this.userDataForm.value,
        staff_code: this.username.value,
        full_name: `${this.userDataForm.value.firstName} ${this.userDataForm.value.lastName}`,
        display_name: `${this.userDataForm.value.firstName} ${this.userDataForm.value.lastName}`,
      } as IBmsUserData;

      this.bmsUserDataStore
        .createData(formValue, {
          success: (item: IBmsUserData) => {
            const value: Partial<ICreateBranchMemberRequest> = {
              child_database_name: 'bms_user_data',
              child_id: item.id as number,
              parent_database_name: 'bms_branch',
              parent_id: this.dialogRef.data.branchId,

              userData: {
                id: item.id,
                displayName: item.display_name,
                staffCode: item.staff_code,
                isAvailable: true,
                createdAt: new Date(),
              } as unknown as IBmsUser,
            };

            this.branchMemerStore
              .createData(value as ICreateBranchMemberRequest, {
                success: (result: IBranchMemberRelation) => {
                  this.dialogRef.close(result);
                },
                error: () => {
                  this.loadingState.set(LoadingState.Error);
                },
              })
              .subscribe();
          },
        })
        .subscribe();
    }
  }
}
