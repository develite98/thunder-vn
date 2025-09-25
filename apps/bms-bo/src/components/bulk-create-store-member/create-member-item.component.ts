import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent } from '@mixcore/base';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { IBranchMember } from '@mixcore/shared-domain';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectToastService } from '@mixcore/ui/toast';
import { tapResponse } from '@ngrx/operators';
import { defer, from, switchMap } from 'rxjs';
import { BranchMemberStore } from '../../state';
import { IExcelUser } from './create-member-item.type';

@Component({
  selector: 'mix-create-member-item',
  imports: [
    MixCopyTextComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    MixIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="p-4 rounded-box border border-base-content/10 border-l-5 border-l-primary/20"
    >
      <div class="flex items-center w-full gap-2">
        <mix-copy-text [text]="data().username"> </mix-copy-text>

        <button
          class="btn btn-xs btn-primary ms-auto"
          [disabled]="isLoading()"
          (click)="onClickSubmit()"
        >
          <mix-icon icon="save" /> Save
        </button>
        <button
          (click)="onRemoveItem.emit()"
          [disabled]="isLoading()"
          class="btn btn-xs btn-square btn-error "
        >
          <mix-icon icon="trash" />
        </button>
      </div>

      @if (loading()) {
        <div class="py-2 mt-2 opacity-60 flex items-center gap-2">
          <span
            class="loading loading-spinner opacity-40 loading-xs me-2"
          ></span>
          Checking user data
        </div>
      } @else {
        <div class="py-2 mt-2 flex flex-col gap-4" [formGroup]="form">
          <mix-form-field [name]="'Full name'" [required]="true">
            <input
              class="input input-bordered w-full"
              formControlName="fullName"
              [placeholder]="'common.input.placeholder' | transloco"
            />
          </mix-form-field>

          @if (!data().haveAccount) {
            <mix-form-field [name]="'Password'" [required]="true">
              <input
                class="input input-bordered w-full"
                formControlName="password"
                type="password"
                [placeholder]="'common.input.placeholder' | transloco"
              />
            </mix-form-field>
          } @else {
            <div class="text-sm opacity-60">
              <div class="flex items-center gap-2">
                <mix-icon icon="info" class="text-info"></mix-icon>
                This user already has an account, password will be ignored.
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class CreateMemberItemComponent extends BaseComponent {
  public client = injectMixClient();
  public store = inject(BranchMemberStore);
  public toast = injectToastService();

  public storeId = input.required<number>();
  public data = input.required<IExcelUser>();
  public loading = input(false);
  public onRemoveItem = output<void>();

  public form = new FormGroup({
    username: new FormControl(''),
    fullName: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit() {
    const data = this.data();
    this.form.patchValue({
      username: data.username,
      fullName: data.displayName || '',
      password: data.password || '',
    });
  }

  public onSave() {
    const data = this.data();
    const memberData: Partial<IBranchMember> = {
      storeId: this.storeId(),
      fullName: this.form.value.fullName || data.displayName || '',
      username: data.username,
      displayName: this.form.value.fullName || data.displayName || '',
      staffCode: this.form.value.username || data.username || '',
      isDisplay: true,
      isAvailable: true,
    };

    const { success: toastSuccess, error: toastError } = this.toast.loading(
      `Saving user ${memberData.displayName}`,
    );

    if (data.haveAccount) {
      return this.store.createData(memberData as IBranchMember).pipe(
        this.observerLoadingState(),
        tapResponse({
          next: () => {
            toastSuccess(`User ${memberData.displayName} saved`);
          },
          error: (err) => {},
        }),
      );
    } else {
      const accountData = {
        userName: data.username,
        email: data.email || '',
        password: this.form.value.password || data.password || '',
        confirmPassword: this.form.value.password || data.password || '',
      };

      const accountRequest = defer(() =>
        from(this.client.auth.register(accountData)),
      );

      return accountRequest.pipe(
        switchMap(() => this.store.createData(memberData as IBranchMember)),
        tapResponse({
          next: () => {
            toastSuccess(`User ${memberData.displayName} saved`);
          },
          error: (err) => {},
        }),
      );
    }
  }

  public onClickSubmit() {
    this.onSave().subscribe({
      next: () => {
        this.onRemoveItem.emit();
      },
    });
  }
}
