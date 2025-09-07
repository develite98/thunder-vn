import { Directive, Input } from '@angular/core';
import { Editor } from '@tiptap/core';

@Directive()
export class BaseEditorPlugin {
  @Input() public editor!: Editor;

  public isActive = (format: string, params?: object) => {
    return this.editor?.isActive(format, params);
  };
}
