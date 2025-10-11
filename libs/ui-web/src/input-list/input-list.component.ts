import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ObjectUtils } from '@mixcore/helper';
import { MixIconComponent } from '@mixcore/ui/icons';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-input-list-string',
  templateUrl: './input-list.component.html',
  imports: [MixIconComponent, DragDropModule],
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixInputListStringComponent {
  public cva = inject<NgxControlValueAccessor<string[] | undefined>>(
    NgxControlValueAccessor,
  );
  public placeHolder = input<string>('');
  public type = input<string>('text');

  public removeItem(item: string) {
    this.cva.value = this.cva.value?.filter((x) => x !== item);
  }

  public addItem() {
    if (this.cva.value) {
      this.cva.value.push('');
    } else {
      this.cva.value = [];
      this.cva.value.push('');
    }
  }

  public onInput(event: Event, index: number) {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement)
      .value;

    if (this.cva.value) this.cva.value[index] = value;

    this.cva.value = ObjectUtils.clone(this.cva.value);
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (this.cva.value)
      moveItemInArray(this.cva.value, event.previousIndex, event.currentIndex);
  }
}
