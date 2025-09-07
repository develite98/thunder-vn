import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MixIconComponent } from '@mixcore/ui/icons';
import { TippyDirective } from '@ngneat/helipopper';
import { Editor } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'mix-ai-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MixIconComponent, TippyDirective],
})
export class AIChatInputComponent {
  public cdr = inject(ChangeDetectorRef);

  public disabled = input(false);
  public placeholder = input('Ask anything here...');
  public files: File[] = [];
  public imagePreviews = signal<string[]>([]);
  public value = '';

  public onSubmit = output<string>();
  public onClearChat = output<void>();

  protected elRef = viewChild<ElementRef<HTMLElement>>('editorContainer');
  protected editor!: Editor;

  ngAfterViewInit(): void {
    const elRef = this.elRef();
    if (!elRef) return;

    this.editor = new Editor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: this.placeholder(),
        }),
      ],
      element: elRef.nativeElement,
      editorProps: {
        attributes: {
          class: 'prose prose-sm md:prose-base focus:outline-none',
        },
        handleKeyDown: (view, event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.submit();
            return true;
          }

          return false;
        },
      },
    });

    this.editor.setOptions({ element: elRef.nativeElement });
    this.editor.on('update', () => {
      this.value = this.editor.getText();
    });
    this.editor.on('selectionUpdate', () => {
      this.cdr.markForCheck();
    });

    this.cdr.detectChanges();
  }

  public fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newFiles = Array.from(input.files || []);
    if (newFiles.length > 0) {
      this.files = this.files.concat(newFiles);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.update((prev) => [...prev, e.target.result]);
        };

        reader.readAsDataURL(file);
      });
    }
  }

  public removeFile(index: number): void {
    this.files.splice(index, 1);
    this.imagePreviews.update((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  }

  public submit(): void {
    if (this.value.trim() || this.files.length > 0) {
      this.onSubmit.emit(this.value);
      this.editor.commands.clearContent();
    }
  }
}
