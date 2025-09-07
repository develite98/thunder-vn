import { Component, computed, inject, input } from '@angular/core';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-input',
  template: `
    <div class="relative">
      @if (showInput()) {
        <input
          type="text"
          [value]="cva.value || ''"
          [placeholder]="placeHolder() || 'Enter value here...'"
          [type]="type()"
          (input)="onInput($event)"
          [minLength]="minLength()"
          [maxLength]="maxLength()"
          class="w-full input input-bordered"
        />
      } @else {
        <textarea
          [value]="cva.value || ''"
          (input)="onInput($event)"
          [minLength]="minLength()"
          [maxLength]="maxLength()"
          [placeholder]="placeHolder() || 'Enter value here...'"
          rows="3"
          class="w-full textarea textarea-bordered"
        ></textarea>
      }

      @if (maxLength() != null) {
        <div class="absolute bottom-2 right-3 text-xs text-base-content/50">
          {{ (cva.value || '').length }} / {{ maxLength() }}
        </div>
      }
    </div>
  `,
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class MixInputComponent {
  public placeHolder = input<string>('');
  public type = input<string>('text');

  public cva = inject<NgxControlValueAccessor<string>>(NgxControlValueAccessor);

  public minLength = input<number | null>(null);
  public maxLength = input<number | null>(null);

  public showInput = computed(() => {
    const ml = this.maxLength();

    return ml == null || ml <= 100;
  });

  public onInput(event: Event) {
    this.cva.value = (
      event.target as HTMLInputElement | HTMLTextAreaElement
    ).value;
  }
}
