import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  input,
  Renderer2,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Editor } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import {
  EditorBlockquoteComponent,
  EditorBoldComponent,
  EditorCodeComponent,
  EditorItalicComponent,
  EditorRedoComponent,
  EditorUnderlineComponent,
  EditorUndoComponent,
} from './plugin/base-tools';

import { EditorYoutubeEmbedTool } from './plugin/embed-tools';
import { EditorHeadingsComponent } from './plugin/heading-tools';
import { EditorImageTools } from './plugin/image-tools';
import { EditorAlignTools } from './plugin/text-align-tools';

@Component({
  selector: 'mix-rich-text-editor',
  styleUrls: ['./rich-text-editor.component.css'],
  templateUrl: './rich-text-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    EditorBoldComponent,
    EditorItalicComponent,
    EditorUnderlineComponent,
    EditorRedoComponent,
    EditorUndoComponent,
    EditorBlockquoteComponent,
    EditorHeadingsComponent,
    EditorAlignTools,
    EditorCodeComponent,
    EditorImageTools,
    EditorYoutubeEmbedTool,
  ],
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class MixRichTextEditorComponent {
  protected readonly translate = inject(TranslocoService);
  protected elRef = viewChild<ElementRef<HTMLElement>>('editorContainer');
  protected cva = inject<NgxControlValueAccessor<string | Date | undefined>>(
    NgxControlValueAccessor,
  );

  protected renderer = inject(Renderer2);
  protected changeDetectorRef = inject(ChangeDetectorRef);
  protected editor!: Editor;

  readonly outputFormat = input<'json' | 'html'>('html');
  readonly placeholder = input<string>('Write something here…');

  @Input() public fileUploadFn?: (file: File) => Promise<string>;
  @Input() public base64FileUploadFn?: (content: string) => Promise<string>;

  ngAfterViewInit(): void {
    const elRef = this.elRef();
    if (!elRef) return;

    this.editor = new Editor({
      extensions: [
        StarterKit,
        Image,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: this.placeholder(),
        }),
        Youtube.configure({
          inline: false,
          allowFullscreen: true,
        }),
      ],
      element: elRef.nativeElement,
      editorProps: {
        attributes: {
          class: 'prose prose-sm md:prose-base m-5 focus:outline-none',
        },
      },
      content: this.cva.value || '',
    });

    this.editor.setOptions({ element: elRef.nativeElement });
    this.editor.on('blur', () => {
      //
    });

    this.editor.on('update', () => {
      this.cva.value = this.editor.getHTML();
    });

    this.editor.on('selectionUpdate', () => {
      this.changeDetectorRef.markForCheck();
    });

    this.changeDetectorRef.detectChanges();
  }

  isActive = (format: string) => {
    return this.editor?.isActive(format);
  };
}
