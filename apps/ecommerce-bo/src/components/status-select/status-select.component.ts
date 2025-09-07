import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  TemplateRef,
} from '@angular/core';
import { EMixContentStatus } from '@mixcore/sdk-client';
import { MixStatusIndicatorComponent } from '@mixcore/ui/status-indicator';
import { TippyDirective } from '@ngneat/helipopper';

@Component({
  selector: 'status-select',
  standalone: true,
  imports: [TippyDirective, NgTemplateOutlet, MixStatusIndicatorComponent],
  templateUrl: './status-select.component.html',
  styleUrl: './status-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusSelectComponent {
  public contentTemplate = input<TemplateRef<unknown>>();
  public mode = input<'tag' | 'select'>('select');
  public inline = input(false);

  public selectedStatus = model<EMixContentStatus | undefined>(
    EMixContentStatus.Draft,
  );

  public selectedChange = output<EMixContentStatus>();
  public statuses = [
    EMixContentStatus.Draft,
    EMixContentStatus.Deleted,
    EMixContentStatus.Published,
  ];
}
