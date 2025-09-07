import { Component } from '@angular/core';
import { MixIconComponent } from '@mixcore/ui/icons';
import { TippyDirective } from '@ngneat/helipopper';
import { BaseEditorPlugin } from './base.plugin';

@Component({
  selector: 'mix-editor-embed-tool',
  imports: [MixIconComponent, TippyDirective],
  template: `
    <button
      class="btn btn-sm btn-outline btn-square"
      [tp]="tpl"
      [tpDelay]="0"
      [tpVariation]="'popper'"
      [tpPlacement]="'bottom-start'"
      [tpHideOnClick]="false"
    >
      <mix-icon icon="youtube" />
    </button>

    <ng-template #tpl let-hide>
      <div class="p-2 border border-base-content/10 bg-base-100 rounded-box">
        <input
          placeholder="Enter YouTube URL"
          class="input input-bordered w-full"
          #urlInput
        />

        <button
          class="btn btn-primary btn-sm mt-2"
          (click)="
            editor
              .chain()
              .focus()
              .setYoutubeVideo({ src: urlInput.value, width: 320, height: 180 })
              .run();
            hide()
          "
        >
          <mix-icon icon="youtube" class="mr-2" />
          Insert YouTube
        </button>
      </div>
    </ng-template>
  `,
})
export class EditorYoutubeEmbedTool extends BaseEditorPlugin {}
