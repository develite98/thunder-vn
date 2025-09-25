import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { Observable } from 'rxjs';

@Component({
  selector: 'mix-inline-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './inline-input.component.html',
  styleUrls: ['./inline-input.component.scss'],
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class MixInlineInputComponent implements OnInit {
  protected cva = inject<NgxControlValueAccessor<string>>(
    NgxControlValueAccessor,
  );
  @ViewChild('input') public input!: ElementRef<HTMLElement>;
  @Input() public placeHolder = 'Type something';
  @Input() public size: 'base' | 'xl' | '2xl' = 'base';
  @Input() public onSaveFn?: (value: string) => Observable<unknown>;

  public type = input<string>('');

  public editing = signal(false);
  public saving = signal(false);
  public isDataChanged = signal(false);
  public temporaryValue = '';

  public ngOnInit() {
    this.temporaryValue = this.cva.value;
  }

  public toggleEditTitle() {
    this.editing.set(!this.editing());

    if (this.editing()) {
      setTimeout(() => {
        this.input.nativeElement.focus();
      }, 50);
    }
  }

  public onFocusedChange(focused: boolean): void {
    if (!focused) this.editing.set(false);
  }

  public onSave() {
    if (this.onSaveFn) {
      this.cva.value = this.temporaryValue;
      this.saving.set(true);
      this.onSaveFn(this.cva.value).subscribe({
        next: () => {
          this.editing.set(false);
        },
        complete: () => this.saving.set(false),
      });
    } else {
      this.cva.value = this.temporaryValue;
      this.editing.set(false);
    }
  }

  public handleInputChange(value: string) {
    this.temporaryValue = value;
    this.isDataChanged.set(this.cva.value !== this.temporaryValue);
  }
}
