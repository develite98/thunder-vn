import { Component } from '@angular/core';
import { MixIconComponent } from '@mixcore/ui/icons';
import { TippyDirective } from '@ngneat/helipopper';
import { BaseEditorPlugin } from './base.plugin';

@Component({
  selector: 'mix-editor-headings',
  imports: [TippyDirective, MixIconComponent],
  template: `
    <button
      class="btn btn-sm btn-square btn-outline"
      [tp]="tpl"
      [tpDelay]="0"
      [tpVariation]="'popper'"
      [tpTrigger]="'mouseenter'"
      [tpPlacement]="'bottom-start'"
      [tpHideOnClick]="false"
    >
      <mix-icon [icon]="'heading-1'" />
    </button>

    <ng-template #tpl let-hide>
      <ul
        #element
        tabindex="0"
        class="menu bg-base-100 border border-base-content/10 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        @for (item of items; track item) {
          <li
            (click)="hide()"
            (click)="
              editor
                .chain()
                .focus()
                .toggleHeading({ level: $any(item.level) })
                .run()
            "
          >
            <a
              class="w-full flex items-center"
              [class.menu-active]="isActive('heading', { level: item.level })"
            >
              <mix-icon [icon]="item.icon" class="mr-2" />
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </ng-template>
  `,
})
export class EditorHeadingsComponent extends BaseEditorPlugin {
  public items = [
    { level: 1, label: 'Heading 1', icon: 'heading-1' },
    { level: 2, label: 'Heading 2', icon: 'heading-2' },
    { level: 3, label: 'Heading 3', icon: 'heading-3' },
    { level: 4, label: 'Heading 4', icon: 'heading-4' },
    { level: 5, label: 'Heading 5', icon: 'heading-5' },
    { level: 6, label: 'Heading 6', icon: 'heading-6' },
  ];
}
