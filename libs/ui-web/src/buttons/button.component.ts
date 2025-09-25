import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule } from 'lucide-angular';
import { fromEvent } from 'rxjs';

export type MixButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'accent'
  | 'info'
  | 'base';
export type MixButtonStyle = 'outline' | 'dash' | 'soft' | 'ghost' | 'link';
export type MixButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export const CLASS_NAME: Record<MixButtonColor | MixButtonStyle, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  error: 'btn-error',
  warning: 'btn-warning',
  accent: 'btn-accent',
  info: 'btn-info',
  base: 'btn-base',
  outline: 'btn-outline',
  dash: 'btn-dash',
  soft: 'btn-soft',
  ghost: 'btn-ghost',
  link: 'btn-link',
};

@Component({
  selector: 'mix-button',
  templateUrl: './button.component.html',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class MixButtonComponent {
  public inputClass = input<string | null>(null, { alias: 'class' });
  public loading = input<boolean>(false);
  public disabled = input<boolean>(false);
  public prefixIcon = input<string | null>(null);
  public postfixIcon = input<string | null>(null);
  public el = inject(ElementRef<HTMLElement>);

  public color = input<MixButtonColor | undefined>(undefined);
  public type = input<MixButtonStyle | undefined>(undefined);
  public size = input<MixButtonSize | undefined>(undefined);
  public iconButton = input<boolean>(false);

  public click = output<Event>();

  public colorClass = computed(() => {
    const color = this.color();
    const type = this.type();

    const className = CLASS_NAME[color || 'base'] || '';
    const colorType = CLASS_NAME[type || 'base'] || '';
    return `${colorType} ${className}`;
  });

  constructor() {
    fromEvent(this.el.nativeElement, 'click')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (this.disabled() || this.loading()) {
          (event as Event).preventDefault();
          (event as Event).stopPropagation();
          (event as Event).stopImmediatePropagation();
          return false;
        }

        return true;
      });
  }
}
