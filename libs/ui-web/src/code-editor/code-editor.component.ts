import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-code-editor',
  templateUrl: './code-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeEditorComponent, FormsModule],
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class MixCodeEditorComponent implements OnDestroy {
  protected cva = inject<NgxControlValueAccessor<string | undefined>>(
    NgxControlValueAccessor,
  );

  public theme = input<string>('vs-dark');
  public language = input<string>('json');
  public model = signal<CodeModel | undefined>(undefined);
  
  private timeoutId: number | null = null;

  public options = {
    contextmenu: true,
  };

  ngOnInit() {
    this.model.set({
      language: this.language(),
      value: this.cva.value || '',
      uri: '',
    });
  }

  onCodeChanged(value: string) {
    this.cva.value = value;
  }

  onEditorInit(editor: CodeEditorComponent) {
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      editor.formatDocument();
      this.timeoutId = null;
    }, 10);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
