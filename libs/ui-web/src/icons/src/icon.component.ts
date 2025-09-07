import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'mix-icon',
  template: ` <lucide-angular
    [size]="size()"
    [name]="icon()"
    [color]="'currentColor'"
    [strokeWidth]="strokeWidth()"
    class="mix-icon"
  ></lucide-angular>`,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixIconComponent {
  public icon = input.required<string>();
  public size = input<number>(16);
  public strokeWidth = input<number>(2.25);
}
