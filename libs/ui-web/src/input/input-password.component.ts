import { Component, inject, input, signal } from '@angular/core';
import { MixIconComponent } from '@mixcore/ui/icons';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-input-password',
  standalone: true,
  imports: [MixIconComponent],
  template: `
    <label class="input">
      <input
        [type]="showPassword() ? 'text' : 'password'"
        [value]="cva.value || ''"
        [placeholder]="placeholder() || 'Enter password...'"
        (input)="onInput($event)"
        [disabled]="disabled()"
        [name]="name()"
        [autocomplete]="autocomplete()"
        [id]="id()"
        class="grow"
      />

      <button
        type="button"
        (click)="togglePasswordVisibility()"
        class="btn btn-ghost btn-sm btn-square -me-1"
        [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
      >
        <mix-icon
          [icon]="showPassword() ? 'eye-off' : 'eye'"
          class="w-4 h-4 text-base-content/60"
        />
      </button>
    </label>
  `,
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class MixInputPasswordComponent {
  protected cva = inject<NgxControlValueAccessor<string>>(
    NgxControlValueAccessor,
  );

  public placeholder = input<string>('');
  public disabled = input<boolean>(false);
  public showPassword = signal(false);
  public name = input<string>('');
  public autocomplete = input<string>('off');
  public id = input<string>('');

  public togglePasswordVisibility(): void {
    this.showPassword.update((show) => !show);
  }

  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.cva.value = target.value;
  }
}
