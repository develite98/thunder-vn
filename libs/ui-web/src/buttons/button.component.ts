import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

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

  public color = input<MixButtonColor | undefined>(undefined);
  public type = input<MixButtonStyle | undefined>(undefined);
  public size = input<MixButtonSize | undefined>(undefined);
  public iconButton = input<boolean>(false);

  public colorClass = computed(() => {
    const color = this.color();
    const type = this.type();

    const className = CLASS_NAME[color || 'base'] || '';
    const colorType = CLASS_NAME[type || 'base'] || '';
    return `${colorType} ${className}`;
  });
}
