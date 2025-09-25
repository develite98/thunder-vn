import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { BaseComponent } from '@mixcore/base';
import { FormUtils, parseExcelFile } from '@mixcore/helper';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import {
  injectDialogRef,
  MixWizardDialogWrapperComponent,
} from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { defer, forkJoin, from, map, switchMap, tap, timer } from 'rxjs';
import { BranchMemberStore } from '../../state';
import { CreateMemberItemComponent } from './create-member-item.component';
import { IExcelUser } from './create-member-item.type';

@Component({
  selector: 'mix-bulk-create-store-member',
  templateUrl: './bulk-create-store-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MixWizardDialogWrapperComponent,
    MixIconComponent,
    MixButtonComponent,
    CreateMemberItemComponent,
    ReactiveFormsModule,
  ],
})
export class BulkCreateStoreMemberComponent extends BaseComponent {
  readonly dialogRef = injectDialogRef();
  readonly client = injectMixClient();
  readonly store = inject(BranchMemberStore);

  public items = viewChildren(CreateMemberItemComponent);
  public users = signal<IExcelUser[]>([]);
  public storeId: number = this.dialogRef.data?.storeId;
  public textInput = new FormControl('', Validators.required);

  public parsingError = signal('');

  public isChecking = computed(() => {
    return this.users().some((u) => u.isChecking);
  });

  constructor() {
    super();
  }

  public onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) return;

    parseExcelFile(
      target.files[0],
      ['Username', 'Full Name', 'Password', 'Email'],
      ['Username', 'Email'],
    )
      .then((data) => {
        this.users.set(
          data.data
            .map((item) => ({
              username: item['Username'],
              displayName: item['Full Name'] || '',
              password: item['Password'] || '',
              email: item['Email'] || '',
            }))
            .filter(
              (x) =>
                this.store
                  .dataEntities()
                  .findIndex((u) => u.username === x.username) === -1,
            ),
        );

        if (data.data?.length) this.checkExist();
      })
      .catch((err) => {
        this.parsingError.set(err || 'Cannot parse the file');
      });
  }

  public checkExist() {
    const users = this.users();
    const updatedUsers = users.map((user) => ({
      ...user,
      isChecking: true,
    }));

    this.users.set(updatedUsers);

    const checkUserExistRequest = users.map((u) =>
      defer(() => from(this.client.auth.checkUserExist(u.username))).pipe(
        map((result) => {
          return result
            ? { ...u, haveAccount: true }
            : { ...u, haveAccount: false };
        }),
      ),
    );

    const delayRequest = checkUserExistRequest.map((r, index) => {
      return timer(index * 600).pipe(
        switchMap(() => r),
        tap((user) => {
          const list = this.users();
          const idx = list.findIndex((u) => u.username === user.username);
          if (idx !== -1) {
            list[idx] = { ...user, isChecking: false };
            this.users.set([...list]);
          }
        }),
      );
    });

    forkJoin(delayRequest).subscribe({
      next: (results) => {
        console.log('results', results);
      },
    });
  }

  public onRemoveItem(item: IExcelUser) {
    const list = this.users();
    this.users.set(list.filter((u) => u.username !== item.username));
  }

  public onSubmitFromInput() {
    FormUtils.validateForm$(this.textInput).then(() => {
      const usernames = this.textInput.value?.split(',') || [];
      const newUsers = usernames
        .map((username: string) => ({
          username: username.trim(),
          displayName: '',
          password: '',
          email: '',
        }))
        .filter(
          (x) =>
            this.store
              .dataEntities()
              .findIndex((u) => u.username === x.username) === -1,
        );

      if (newUsers.length) {
        this.users.set([...newUsers]);
        this.textInput.setValue('');
        this.checkExist();
      }
    });
  }

  public onBulkCreate() {
    const items = this.items();
    if (items.length === 0) return;

    const requests = items.map((item) => item.onSave());
    forkJoin(requests)
      .pipe(this.observerLoadingState())
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
      });
  }

  public downloadSample() {
    const a = document.createElement('a');
    a.href = '/file-sample/store-member.csv';
    a.setAttribute('download', 'store-member.csv');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
