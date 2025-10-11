import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { defer, forkJoin, from, map, switchMap, tap, timer } from 'rxjs';

import { BaseComponent } from '@mixcore/base';
import { FormUtils, parseExcelFile } from '@mixcore/helper';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import {
  injectDialogRef,
  MixWizardDialogWrapperComponent,
} from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';

import { UserStore } from '../../state';
import { CreateUserItemComponent } from './create-user-item.component';
import { IExcelUser } from './create-user-item.type';

@Component({
  selector: 'mix-bulk-create-user',
  templateUrl: './bulk-create-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MixWizardDialogWrapperComponent,
    MixIconComponent,
    MixButtonComponent,
    CreateUserItemComponent,
    ReactiveFormsModule,
  ],
})
export class BulkCreateUserComponent extends BaseComponent {
  public readonly dialogRef = injectDialogRef();
  public readonly client = injectMixClient();
  public readonly store = inject(UserStore);

  protected readonly items = viewChildren(CreateUserItemComponent);
  protected readonly users = signal<IExcelUser[]>([]);
  protected readonly parsingError = signal('');
  protected readonly textInput = new FormControl('', [Validators.required]);
  protected readonly isChecking = computed(() =>
    this.users().some((user) => user.isChecking),
  );

  public readonly storeId = this.dialogRef.data?.storeId;
  public readonly requiredColumns = [
    'Username',
    'Full Name',
    'Password',
    'Email',
  ];
  public readonly uniqueColumns = ['Username', 'Email'];
  public readonly checkDelay = 600;

  protected onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    parseExcelFile(file, this.requiredColumns, this.uniqueColumns)
      .then((data) => {
        const newUsers = this.mapExcelDataToUsers(data.data);
        const filteredUsers = this.filterExistingUsers(newUsers);

        this.users.set(filteredUsers);

        if (filteredUsers.length > 0) {
          this.checkUsersExistence();
        }
      })
      .catch((error) => {
        this.parsingError.set(error || 'Cannot parse the file');
      });
  }

  public mapExcelDataToUsers(data: any[]): IExcelUser[] {
    return data.map((item) => ({
      username: item['Username'],
      displayName: item['Full Name'] || '',
      password: item['Password'] || '',
      email: item['Email'] || '',
    }));
  }

  public filterExistingUsers(users: IExcelUser[]): IExcelUser[] {
    const existingUsernames = this.store
      .dataEntities()
      .map((user) => user.userName);
    return users.filter((user) => !existingUsernames.includes(user.username));
  }

  public checkUsersExistence(): void {
    this.setUsersCheckingState(true);

    const checkRequests = this.users().map((user, index) =>
      timer(index * this.checkDelay).pipe(
        switchMap(() =>
          defer(() => from(this.client.auth.checkUserExist(user.username))),
        ),
        map((exists) => ({ ...user, haveAccount: exists ?? false })),
        tap((updatedUser) => this.updateUserInList(updatedUser)),
      ),
    );

    forkJoin(checkRequests).subscribe();
  }

  public setUsersCheckingState(isChecking: boolean): void {
    const updatedUsers = this.users().map((user) => ({ ...user, isChecking }));
    this.users.set(updatedUsers);
  }

  public updateUserInList(updatedUser: IExcelUser): void {
    const users = this.users();
    const index = users.findIndex(
      (user) => user.username === updatedUser.username,
    );

    if (index !== -1) {
      users[index] = { ...updatedUser, isChecking: false };
      this.users.set([...users]);
    }
  }

  protected onRemoveItem(item: IExcelUser): void {
    const filteredUsers = this.users().filter(
      (user) => user.username !== item.username,
    );
    this.users.set(filteredUsers);
  }

  protected onSubmitFromInput(): void {
    FormUtils.validateForm$(this.textInput).then(() => {
      const usernames = this.parseUsernamesFromInput();
      const newUsers = this.createUsersFromUsernames(usernames);
      const filteredUsers = this.filterExistingUsers(newUsers);

      if (filteredUsers.length > 0) {
        this.users.set(filteredUsers);
        this.textInput.reset();
        this.checkUsersExistence();
      }
    });
  }

  public parseUsernamesFromInput(): string[] {
    return (this.textInput.value?.split(',') || [])
      .map((username) => username.trim())
      .filter((username) => username.length > 0);
  }

  public createUsersFromUsernames(usernames: string[]): IExcelUser[] {
    return usernames.map((username) => ({
      username,
      displayName: '',
      password: '',
      email: '',
    }));
  }

  protected onBulkCreate(): void {
    const items = this.items();

    if (items.length === 0) return;

    const saveRequests = items.map((item) => item.onSave());

    forkJoin(saveRequests)
      .pipe(this.observerLoadingState())
      .subscribe({
        next: () => this.dialogRef.close(true),
      });
  }

  protected downloadSample(): void {
    this.triggerFileDownload(
      '/file-sample/store-member.csv',
      'store-member.csv',
    );
  }

  public triggerFileDownload(href: string, filename: string): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = href;
    downloadLink.setAttribute('download', filename);

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
