import { Component, Input } from '@angular/core';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixImageUploadComponent } from '@mixcore/ui/uploader';
import { BaseEditorPlugin } from './base.plugin';

@Component({
  selector: 'mix-editor-image',
  imports: [MixIconComponent],
  template: `
    <button
      (click)="openImageDialog()"
      class="btn btn-sm btn-outline btn-square"
    >
      <mix-icon icon="image" />
    </button>
  `,
})
export class EditorImageTools extends BaseEditorPlugin {
  public dialog = injectDialog();

  @Input() public fileUploadFn?: (file: File) => Promise<string>;
  @Input() public base64FileUploadFn?: (content: string) => Promise<string>;

  public openImageDialog() {
    const ref = this.dialog.open(MixImageUploadComponent, {
      enableClose: {
        backdrop: false,
        escape: false,
      },
      data: {
        fileUploadFn: this.fileUploadFn,
        base64FileUploadFn: this.base64FileUploadFn,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (result) {
        this.editor.chain().focus().setImage({ src: result }).run();
      }
    });
  }
}
