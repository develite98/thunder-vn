import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';

import { TranslocoPipe } from '@jsverse/transloco';
import { FormUtils } from '@mixcore/helper';

@Component({
  selector: 'aias-chat-room-create',
  imports: [
    MixDialogWrapperComponent,
    ReactiveFormsModule,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
  ],
  template: `
    <mix-dialog-wrapper [title]="'Create new conversation'">
      <div dialog-body [formGroup]="form">
        <mix-form-field
          [required]="true"
          [autoFocus]="true"
          [name]="'Title'"
          [description]="'Enter a name for your new conversation.'"
        >
          <input
            #autofocus
            formControlName="name"
            class="input input-bordered"
            [placeholder]="'common.input.placeholder' | transloco"
          />
        </mix-form-field>
      </div>
      <div dialog-footer class="flex items-center justify-between gap-2">
        <mix-button [type]="'ghost'" (click)="dialogRef.close()">
          {{ 'common.cancel' | transloco }}
        </mix-button>
        <mix-button [color]="'primary'" (click)="onSubmit()">
          {{ 'common.create' | transloco }}
        </mix-button>
      </div>
    </mix-dialog-wrapper>
  `,
})
export class AiChatRoomCreateComponent {
  public dialogRef = injectDialogRef();
  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  public onSubmit() {
    FormUtils.validateForm$(this.form).then((value) => {
      this.dialogRef.close(value.name);
    });
  }
}
