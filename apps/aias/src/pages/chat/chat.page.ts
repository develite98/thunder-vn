import { Component, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { injectQueryParams } from '@mixcore/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { injectModalService } from '@mixcore/ui/modal';

import { injectDialog } from '@mixcore/ui/dialog';
import {
  AIChatInputComponent,
  AIChatMenuComponent,
  AIChatMessasageComponent,
  AiChatRoomCreateComponent,
} from '../../components';
import {
  AiChatHubStore,
  AiChatMessageStore,
  TestMessageStore,
  TestRoomStore,
} from '../../state';

@Component({
  selector: 'mix-ai-chat-page',
  templateUrl: './chat.page.html',
  imports: [
    AIChatInputComponent,
    AIChatMessasageComponent,
    AIChatMenuComponent,
  ],
})
export class MixAIChatPage extends BasePageComponent {
  public modal = injectModalService();
  public chatMessageStore = inject(AiChatMessageStore);
  public chatHubStore = inject(AiChatHubStore);
  public chatMessages = inject(TestMessageStore);
  public chatRooms = inject(TestRoomStore);
  public queryParams = injectQueryParams();
  public dialog = injectDialog();

  public client = injectMixClient();

  public override ngOnInit(): void {
    super.ngOnInit();

    this.chatHubStore.connect(true);
    this.chatRooms.search();
  }

  public onChatSubmit(value: string): void {
    if (!value) return;

    const roomId = this.queryParams()['room'];
    if (!roomId) {
      const ref = this.dialog.open(AiChatRoomCreateComponent);
      ref.afterClosed$.subscribe((title) => {
        this.chatRooms.newRoom(title || '');
      });
    } else {
      this.chatHubStore.askAi(value);
    }
  }

  public onClearChat(): void {
    this.modal.asKForAction(
      'Are you sure you want to clear the chat? Your data will can not revert.',
      () => {
        this.chatMessageStore.clearMessages();
      },
    );
  }
}
