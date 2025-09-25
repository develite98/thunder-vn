import { Component } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixDatePickerComponent } from '@mixcore/ui/date-picker';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixKeyValueEditorComponent } from '@mixcore/ui/key-value-editor';
import { MixRichTextEditorComponent } from '@mixcore/ui/rich-text-editor';
import { MixImageUploadComponent } from '@mixcore/ui/uploader';

import { MixToggleComponent } from '@mixcore/ui/toggle';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';
import { IPropsConfig } from '../../types';

@Component({
  selector: 'mix-form-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes, TranslocoPipe],
  template: `
    <input
      class="w-full input form-control"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="props.placeholder | transloco"
      [type]="props.type || 'text'"
    />
  `,
})
export class FormInputComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'mix-form-textarea',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes, TranslocoPipe],
  template: `
    <div class="w-full relative">
      <textarea
        class="textarea textarea-bordered form-control w-full"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [placeholder]="props.placeholder | transloco"
        [rows]="props.rows || 6"
      ></textarea>
    </div>
  `,
})
export class FormTextAreaComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'mix-form-select',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes, TranslocoPipe],
  template: `
    <select
      class="select select-bordered form-control w-full"
      [formControl]="formControl"
      [formlyAttributes]="field"
    >
      @for (opt of props['options'] || []; track opt.value) {
        <option [value]="opt.value">
          {{ opt.label | transloco }}
        </option>
      }
    </select>
  `,
})
export class FormSelectComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'mix-form-date-picker',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes, MixDatePickerComponent],
  template: `
    <mix-date-picker
      class="block form-control w-full"
      [formControl]="formControl"
      [formlyAttributes]="field"
    ></mix-date-picker>
  `,
})
export class FormDatePickerComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'mix-form-rich-text-editor',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes, MixRichTextEditorComponent],
  template: `
    <mix-rich-text-editor
      class="block form-control w-full"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [fileUploadFn]="fileUploadFn"
      [base64FileUploadFn]="base64FileUploadFn"
    ></mix-rich-text-editor>
  `,
})
export class FormRichTextEditorComponent extends FieldType<FieldTypeConfig> {
  public base64FileUploadFn = (this.props as IPropsConfig).base64FileUploadFn;
  public fileUploadFn = (this.props as IPropsConfig).fileUploadFn;

  ngOnInit(): void {
    this.base64FileUploadFn = (this.props as IPropsConfig).base64FileUploadFn;
    this.fileUploadFn = (this.props as IPropsConfig).fileUploadFn;
  }
}

@Component({
  selector: 'mix-form-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormlyAttributes,
    TranslocoPipe,
    MixIconComponent,
    MixButtonComponent,
  ],
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 w-full">
        <input
          class="input input-bordered form-control grow"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [placeholder]="props.placeholder | transloco"
          [type]="props.type || 'text'"
        />

        <button class="btn btn-square" (click)="onUpLoad()">
          <mix-icon icon="image-up" />
        </button>
      </div>

      @if (formControl.value) {
        <div
          class="w-full min-h-[360px] h-[360px] rounded-box bg-base-200 border border-base-content/10 relative"
        >
          <img
            [src]="formControl.value"
            class="w-auto h-full object-cover rounded-box mx-auto"
          />

          <mix-button
            (click)="formControl.setValue('')"
            class="absolute top-2 right-2 btn-sm"
            type="ghost"
            [iconButton]="true"
          >
            <mix-icon icon="trash" class="text-error"></mix-icon>
          </mix-button>
        </div>
      }
    </div>
  `,
})
export class FormImageUploadComponent extends FieldType<FieldTypeConfig> {
  public dialog = injectDialog();

  onUpLoad() {
    const ref = this.dialog.open(MixImageUploadComponent, {
      data: {
        fileUploadFn: (file: File) => {
          return (this.props as IPropsConfig)?.fileUploadFn?.(file);
        },
        base64FileUploadFn: (content: string) => {
          return (this.props as IPropsConfig)?.base64FileUploadFn?.(content);
        },
        aspectRatios: (this.props as IPropsConfig)?.aspectRatios,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (result) {
        this.formControl.setValue(result);
      }
    });
  }
}

@Component({
  selector: 'mix-form-key-value-editor',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes, MixKeyValueEditorComponent],
  template: `
    <mix-key-value-editor
      class="w-full"
      [value]="formControl.value"
      (valueChange)="formControl.patchValue($event)"
      [formlyAttributes]="field"
      [keyPlaceholder]="props['keyPlaceholder']"
      [valuePlaceholder]="props['valuePlaceholder']"
    />
  `,
})
export class FormKeyValueInput extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'mix-form-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes, MixToggleComponent],
  template: `
    <mix-toggle
      class="block form-control w-full"
      [formControl]="formControl"
      [formlyAttributes]="field"
    ></mix-toggle>
  `,
})
export class FormCheckboxComponent extends FieldType<FieldTypeConfig> {}
