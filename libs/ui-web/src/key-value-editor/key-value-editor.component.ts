/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, inject, input, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mix-key-value-editor',
  templateUrl: './key-value-editor.component.html',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    MixIconComponent,
    DragDropModule,
  ],
})
export class MixKeyValueEditorComponent {
  readonly fb = inject(FormBuilder);

  public value = input<Record<string, any>>({});
  public valueChange = output<Record<string, any>>();

  public keyPlaceholder = input<string>('common.keyPlaceholder');
  public valuePlaceholder = input<string>('common.valuePlaceholder');
  public addButtonLabel = input<string>('Add item');

  private sub?: Subscription;

  public form = this.fb.group({
    items: this.fb.array([]),
  });

  public get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  ngOnInit() {
    this.populateFormArray(this.value() || {});

    this.sub?.unsubscribe();
    this.sub = this.items.valueChanges.subscribe((v) => {
      this.emitValidValues();
    });

    this.emitValidValues();
  }

  public addItem() {
    this.items.push(this.createItem());
  }

  private createItem(key = '', value: any = ''): FormGroup {
    return this.fb.group({
      key: [key, Validators.required],
      value: [value],
    });
  }

  private populateFormArray(obj: Record<string, string | number>) {
    this.items.clear();
    for (const [key, value] of Object.entries(obj)) {
      this.items.push(this.createItem(key, value));
    }
  }

  private emitValidValues(): void {
    const result: Record<string, any> = {};

    this.items.controls.forEach((group) => {
      const { key, value } = group.value;
      if (key?.trim() && value != null && value !== '') {
        result[key] = value;
      }
    });

    this.valueChange.emit(result);
  }

  drop(event: CdkDragDrop<FormGroup[]>) {
    const itemsArray = this.items;
    moveItemInArray(
      itemsArray.controls,
      event.previousIndex,
      event.currentIndex,
    );

    this.items.updateValueAndValidity();
  }

  public removeItem(index: number) {
    this.items.removeAt(index);
  }
}
