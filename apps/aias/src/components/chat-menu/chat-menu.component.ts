import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { TestRoomStore } from '../../state';

@Component({
  selector: 'aias-chat-menu',
  template: `
    <ul class="menu w-full">
      <li>
        <a>
          <mix-icon icon="plus" />
          {{ 'aias.menu.newChat' | transloco }}</a
        >
      </li>
      <li>
        <a>
          <mix-icon icon="search" />
          {{ 'aias.menu.searchChat' | transloco }}</a
        >
      </li>
    </ul>

    <ul class="menu mt-6 w-full">
      <li class="menu-title">Chats</li>
      @for (room of roomStore.dataEntities(); track room.id) {
        <li>
          <a class="flex items-center group">
            {{ room.roomName || 'Unknown' }}

            <button
              class="ms-auto  w-fit btn btn-xs btn-ghost group-hover:flex hidden"
            >
              <mix-icon
                class="text-error"
                icon="trash"
                (click)="deleteChatRoom(room.id)"
              ></mix-icon>
            </button>
          </a>
        </li>
      }
    </ul>
  `,
  imports: [MixIconComponent, TranslocoPipe],
})
export class AIChatMenuComponent {
  public roomStore = inject(TestRoomStore);
  public modal = injectModalService();

  public deleteChatRoom(roomId: string) {
    this.modal.asKForAction('Are you sure to delete this conversation', () => {
      this.roomStore.removeData(roomId);
    });
  }
}
