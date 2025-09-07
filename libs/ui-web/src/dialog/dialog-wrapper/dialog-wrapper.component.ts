import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Input,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'mix-dialog-wrapper',
  imports: [TranslocoPipe, NgTemplateOutlet],
  templateUrl: './dialog-wrapper.component.html',
  styleUrl: './dialog-wrapper.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MixDialogWrapperComponent {
  @Input() titleTpl: TemplateRef<HTMLElement> | null = null;

  public title = input<string>('');
}
