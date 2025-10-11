import { Component } from '@angular/core';
import {
  IScrollspyMenuItem,
  MixMenuScrollspyComponent,
} from './menu-scrollspy.component';

@Component({
  selector: 'app-scrollspy-example',
  standalone: true,
  imports: [MixMenuScrollspyComponent],
  template: `
    <div class="flex gap-4">
      <div class="w-64">
        <mix-menu-scrollspy
          [title]="'Table of Contents'"
          [items]="menuItems"
          [scrollElementId]="'content-container'"
          [stickyOffset]="164"
        />
      </div>

      <div
        id="content-container"
        class="flex-1 h-96 overflow-y-auto border border-base-300 rounded-lg p-4"
      >
        <div id="section-1" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Section 1</h2>
          <p class="mb-4">This is the content for section 1...</p>
          <p class="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </p>
          <p class="mb-4">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>
        </div>

        <div id="section-2" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Section 2</h2>
          <p class="mb-4">This is the content for section 2...</p>
          <p class="mb-4">
            Ut enim ad minim veniam, quis nostrud exercitation...
          </p>
          <p class="mb-4">
            Duis aute irure dolor in reprehenderit in voluptate...
          </p>
        </div>

        <div id="section-3" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Section 3</h2>
          <p class="mb-4">This is the content for section 3...</p>
          <p class="mb-4">Excepteur sint occaecat cupidatat non proident...</p>
          <p class="mb-4">Sunt in culpa qui officia deserunt mollit anim...</p>
        </div>

        <div id="section-4" class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Section 4</h2>
          <p class="mb-4">This is the content for section 4...</p>
          <p class="mb-4">
            At vero eos et accusamus et iusto odio dignissimos...
          </p>
          <p class="mb-4">
            Et harum quidem rerum facilis est et expedita distinctio...
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ScrollspyExampleComponent {
  menuItems: IScrollspyMenuItem[] = [
    { id: 'section-1', label: 'Introduction' },
    { id: 'section-2', label: 'Getting Started' },
    { id: 'section-3', label: 'Advanced Features' },
    { id: 'section-4', label: 'Conclusion' },
  ];
}
