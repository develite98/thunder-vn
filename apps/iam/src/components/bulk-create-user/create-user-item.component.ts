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
import { IUser } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectToastService } from '@mixcore/ui/toast';
import { tapResponse } from '@ngrx/operators';
import { UserStore } from '../../state';
import { IExcelUser } from './create-user-item.type';

@Component({
  selector: 'mix-create-user-item',
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

        @if (!data().haveAccount) {
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
        }
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
                This user already has an account
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class CreateUserItemComponent extends BaseComponent {
  public client = injectMixClient();
  public store = inject(UserStore);
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
    const accountData = {
      userName: data.username,
      email: data.email || '',
      password: this.form.value.password || data.password || '',
      confirmPassword: this.form.value.password || data.password || '',
    };

    const { success: toastSuccess, error: toastError } = this.toast.loading(
      `Creating user ${accountData.userName}`,
    );

    return this.store.createData(accountData as unknown as IUser).pipe(
      tapResponse({
        next: () => {
          toastSuccess(`User ${accountData.userName} saved`);
        },
        error: (err) => {
          toastError(`User ${accountData.userName} saved error`);
        },
      }),
    );
  }

  public onClickSubmit() {
    if (this.data().haveAccount) {
      this.onRemoveItem.emit();
      return;
    }

    this.onSave().subscribe({
      next: () => {
        this.onRemoveItem.emit();
      },
    });
  }
}
