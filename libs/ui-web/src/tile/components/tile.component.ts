import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mix-tile',
  templateUrl: './tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixTileComponent {
  public className = input<string>('');
}
