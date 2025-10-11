import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixTileComponent } from '@mixcore/ui/tile';

@Component({
  selector: 'mix-inline-alert',
  template: `
    @let stl = style();
    <mix-tile>
      <div class="flex flex-col gap-3">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="flex gap-6 col-span-1 md:col-span-5">
            <div
              class="w-[2px] h-[80%] absolute top-[10%] left-3 rounded-full {{
                stl.bg
              }}"
            ></div>
            <div class="flex flex-col ps-2">
              <h3 class="text-lg font-semibold {{ stl.text }}">
                {{ title() | transloco }}
              </h3>
              <p
                class="text-sm text-base-content/60 w-90"
                [innerHTML]="description() | transloco"
              ></p>
            </div>
          </div>
          <div class="items-center justify-end col-span-1 md:col-span-7">
            @let mainTpl = mainTemplate();
            @if (mainTpl) {
              <ng-container [ngTemplateOutlet]="mainTpl"></ng-container>
            } @else {
              <div class="rounded-lg p-4 bg-base-200 w-full">
                <input
                  [formControl]="form"
                  class="input input-bordered w-full"
                  placeholder="Type ... to continue"
                />
                <div class="text-sm mt-2">
                  Type "<span class="{{ stl.text }} font-bold">{{
                    confirmRequireText()
                  }}</span
                  >" to continue request
                </div>
              </div>
            }
          </div>
        </div>
        @if (!hideToolbar()) {
          <div
            class="h-px w-full border-t border-dashed border-base-content/10"
          ></div>
          <div class="flex justify-end">
            <mix-button
              [disabled]="!canSubmit()"
              [loading]="loading()"
              (click)="onSubmit.emit()"
              color="error"
              >{{ buttonLabel() | transloco }}</mix-button
            >
          </div>
        }
      </div>
    </mix-tile>
  `,
  imports: [
    MixTileComponent,
    ReactiveFormsModule,
    MixButtonComponent,
    TranslocoPipe,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixAlertComponent {
  public type = input<'info' | 'warning' | 'error' | 'success'>('warning');
  public loading = input(false);
  public title = input<string>('common.label.delete');
  public description = input<string>('common.label.deleteConfirmation');
  public buttonLabel = input<string>('common.label.delete');
  public confirmRequireText = input<string>('CONFIRM');
  public hideToolbar = input(false);
  public mainTemplate = input<TemplateRef<unknown> | null>(null);

  public onSubmit = output();
  public canSubmit = signal(false);
  public form = new FormControl('');

  public style = computed(() => {
    const type = this.type();
    switch (type) {
      case 'error':
        return {
          bg: 'bg-error',
          text: 'text-error',
        };
      case 'info':
        return {
          bg: 'bg-info',
          text: 'text-info',
        };
      case 'warning':
        return {
          bg: 'bg-warning',
          text: 'text-warning',
        };
      default:
        return {
          bg: 'bg-success',
          text: 'text-success',
        };
    }
  });

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      this.canSubmit.set(value === this.confirmRequireText());
    });
  }
}
