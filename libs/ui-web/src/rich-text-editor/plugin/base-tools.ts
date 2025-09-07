import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';
import { BaseEditorPlugin } from './base.plugin';

@Component({
  selector: 'mix-editor-undo',
  imports: [MixIconComponent, TranslocoPipe],
  template: `
    <div class="tooltip" [attr.data-tip]="'common.undo' | transloco">
      <button
        class="btn btn-sm btn-square btn-ghost"
        (click)="editor.chain().focus().undo().run()"
        [disabled]="!editor.can().chain().focus().undo().run()"
      >
        <mix-icon icon="undo" />
      </button>
    </div>
  `,
})
export class EditorUndoComponent extends BaseEditorPlugin {}

@Component({
  selector: 'mix-editor-redo',
  imports: [MixIconComponent, TranslocoPipe],
  template: `
    <div class="tooltip" [attr.data-tip]="'common.redo' | transloco">
      <button
        class="btn btn-sm btn-square btn-ghost"
        (click)="editor.chain().focus().redo().run()"
        [disabled]="!editor.can().chain().focus().redo().run()"
      >
        <mix-icon icon="redo" />
      </button>
    </div>
  `,
})
export class EditorRedoComponent extends BaseEditorPlugin {}

@Component({
  selector: 'mix-editor-bold',
  imports: [MixIconComponent, TranslocoPipe],
  template: `
    <div class="tooltip" [attr.data-tip]="'common.bold' | transloco">
      <button
        class="btn btn-sm btn-outline btn-square"
        (click)="editor.chain().focus().toggleBold().run()"
        [class.btn-primary]="isActive('bold')"
      >
        <mix-icon icon="bold" />
      </button>
    </div>
  `,
})
export class EditorBoldComponent extends BaseEditorPlugin {}

@Component({
  selector: 'mix-editor-italic',
  imports: [MixIconComponent, TranslocoPipe],
  template: `
    <div class="tooltip" [attr.data-tip]="'common.italic' | transloco">
      <button
        class="btn btn-sm btn-outline btn-square"
        (click)="editor.chain().focus().toggleItalic().run()"
        [class.btn-primary]="isActive('italic')"
      >
        <mix-icon icon="italic" />
      </button>
    </div>
  `,
})
export class EditorItalicComponent extends BaseEditorPlugin {}

@Component({
  selector: 'mix-editor-underline',
  imports: [MixIconComponent, TranslocoPipe],
  template: `
    <div class="tooltip" [attr.data-tip]="'common.underline' | transloco">
      <button
        class="btn btn-sm btn-outline btn-square"
        (click)="editor.chain().focus().toggleUnderline().run()"
        [class.btn-primary]="isActive('underline')"
      >
        <mix-icon icon="underline" />
      </button>
    </div>
  `,
})
export class EditorUnderlineComponent extends BaseEditorPlugin {}

@Component({
  selector: 'mix-editor-strike',
  imports: [MixIconComponent],
  template: `<button
    class="btn btn-sm"
    (click)="editor.chain().focus().toggleStrike().run()"
    [class.btn-primary]="isActive('strike')"
  >
    <mix-icon icon="strikethrough" />
  </button>`,
})
export class EditorStrikeComponent extends BaseEditorPlugin {}

@Component({
  selector: 'mix-editor-code',
  imports: [MixIconComponent, TranslocoPipe],
  template: `<button
    class="btn btn-sm btn-outline "
    (click)="editor.chain().focus().toggleCode().run()"
    [class.btn-primary]="isActive('code')"
  >
    <mix-icon icon="code" />
    <span>{{ 'common.codeBlock' | transloco }}</span>
  </button>`,
})
export class EditorCodeComponent extends BaseEditorPlugin {}

// @Component({
//   selector: 'mix-editor-h1',
//   imports: [MixIconComponent],
//   template: `<button
//     class="btn btn-sm"
//     (click)="editor.chain().focus().toggleHeading({ level: 1 }).run()"
//     [class.btn-primary]="isActive('heading', { level: 1 })"
//   >
//     <mix-icon icon="heading-1" />
//     <span>H1</span>
//   </button>`,
// })
// export class EditorH1Component extends BaseEditorPlugin {}

// @Component({
//   selector: 'mix-editor-h2',
//   imports: [MixIconComponent],
//   template: `<button
//     class="btn btn-sm"
//     (click)="editor.chain().focus().toggleHeading({ level: 2 }).run()"
//     [class.btn-primary]="isActive('heading', { level: 2 })"
//   >
//     <mix-icon icon="heading-2" />
//     <span>H2</span>
//   </button>`,
// })
// export class EditorH2Component extends BaseEditorPlugin {}

// @Component({
//   selector: 'mix-editor-h3',
//   imports: [MixIconComponent],
//   template: `<button
//     class="btn btn-sm"
//     (click)="editor.chain().focus().toggleHeading({ level: 3 }).run()"
//     [class.btn-primary]="isActive('heading', { level: 3 })"
//   >
//     <mix-icon icon="heading-3" />
//     <span>H3</span>
//   </button>`,
// })
// export class EditorH3Component extends BaseEditorPlugin {}

// @Component({
//   selector: 'mix-editor-bullet-list',
//   imports: [MixIconComponent],
//   template: `<button
//     class="btn btn-sm"
//     (click)="editor.chain().focus().toggleBulletList().run()"
//     [class.btn-primary]="isActive('bulletList')"
//   >
//     <mix-icon icon="list" />
//     <span>Bullet List</span>
//   </button>`,
// })
// export class EditorBulletListComponent extends BaseEditorPlugin {}

// @Component({
//   selector: 'mix-editor-ordered-list',
//   imports: [MixIconComponent],
//   template: `<button
//     class="btn btn-sm"
//     (click)="editor.chain().focus().toggleOrderedList().run()"
//     [class.btn-primary]="isActive('orderedList')"
//   >
//     <mix-icon icon="list-ordered" />
//     <span>Ordered List</span>
//   </button>`,
// })
// export class EditorOrderedListComponent extends BaseEditorPlugin {}

@Component({
  selector: 'mix-editor-blockquote',
  imports: [MixIconComponent, TranslocoPipe],
  template: `
    <button
      class="btn btn-sm btn-outline"
      (click)="editor.chain().focus().toggleBlockquote().run()"
      [class.btn-primary]="isActive('blockquote')"
    >
      <mix-icon icon="quote" />
      <span>{{ 'common.blockquote' | transloco }}</span>
    </button>
  `,
})
export class EditorBlockquoteComponent extends BaseEditorPlugin {}

@Component({
  selector: 'mix-editor-clear-format',
  imports: [MixIconComponent],
  template: `<button
    class="btn btn-sm"
    (click)="editor.chain().focus().clearNodes().unsetAllMarks().run()"
  >
    <mix-icon icon="remove-formatting" />
    <span>Clear Format</span>
  </button>`,
})
export class EditorClearFormatComponent extends BaseEditorPlugin {}
