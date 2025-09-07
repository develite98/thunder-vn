import { Component } from '@angular/core';
import { MixIconComponent } from '@mixcore/ui/icons';
import { BaseEditorPlugin } from './base.plugin';

@Component({
  selector: 'mix-editor-aligns',
  imports: [MixIconComponent],
  template: `
    <div class="join">
      <button
        (click)="editor.chain().focus().setTextAlign('left').run()"
        class="btn btn-sm btn-outline btn-square join-item"
        [class.btn-primary]="isActive('textAlign', { textAlign: 'left' })"
      >
        <mix-icon icon="align-left" />
      </button>
      <button
        class="btn btn-sm btn-outline btn-square join-item"
        (click)="editor.chain().focus().setTextAlign('center').run()"
        [class.btn-primary]="isActive('textAlign', { textAlign: 'center' })"
      >
        <mix-icon icon="align-center" />
      </button>
      <button
        class="btn btn-sm btn-outline btn-square join-item"
        (click)="editor.chain().focus().setTextAlign('right').run()"
        [class.btn-primary]="isActive('textAlign', { textAlign: 'right' })"
      >
        <mix-icon icon="align-right" />
      </button>
    </div>
  `,
})
export class EditorAlignTools extends BaseEditorPlugin {}
