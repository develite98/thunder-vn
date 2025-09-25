import { Component, inject } from '@angular/core';
import { EMixContentStatus } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixStatusIndicatorComponent } from '@mixcore/ui/status-indicator';
import { TippyDirective } from '@ngneat/helipopper';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-status-select',
  templateUrl: './status-select.component.html',
  standalone: true,
  imports: [TippyDirective, MixIconComponent, MixStatusIndicatorComponent],
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class MixStatusSelectComponent {
  protected cva = inject<NgxControlValueAccessor<EMixContentStatus>>(
    NgxControlValueAccessor,
  );

  public statuses = [
    EMixContentStatus.Draft,
    EMixContentStatus.Published,
    EMixContentStatus.Deleted,
  ];

  public labels: Record<string, string> = {
    [EMixContentStatus.Draft]: 'content.status.draft',
    [EMixContentStatus.Published]: 'content.status.published',
    [EMixContentStatus.Deleted]: 'content.status.deleted',
  };
}
