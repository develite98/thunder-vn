import { Component, ContentChild, ElementRef, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';

@Component({
  selector: 'mix-form-field',
  templateUrl: './form-field.component.html',
  imports: [TranslocoPipe, MixIconComponent],
  providers: [],
  host: {
    class: 'block',
  },
})
export class MixFormFieldComponent {
  public name = input<string | undefined>();
  public description = input<string | undefined>();
  public required = input<boolean>(false);
  public autoFocus = input<boolean>(false);

  @ContentChild('autofocus', { static: false, descendants: true })
  inputElementRef!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    if (this.autoFocus() && this.inputElementRef) {
      this.inputElementRef.nativeElement.focus();
    }
  }
}
