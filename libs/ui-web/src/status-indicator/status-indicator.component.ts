import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { EMixContentStatus } from '@mixcore/sdk-client';

@Component({
  selector: 'mix-status-indicator',
  templateUrl: './status-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
})
export class MixStatusIndicatorComponent {
  public STATUS = EMixContentStatus;
  public status = input<EMixContentStatus>(EMixContentStatus.Draft);
  public reverse = input<boolean>(false);
}
