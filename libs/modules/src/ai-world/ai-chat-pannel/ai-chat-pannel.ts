import { Component } from '@angular/core';
import { MixIconComponent } from '@mixcore/ui/icons';

export interface AiChatMessage {
  isSuccess: boolean;
  response: string;
}

@Component({
  selector: 'mix-ai-chat-pannel',
  imports: [MixIconComponent],
  templateUrl: './ai-chat-pannel.html',
  styleUrl: './ai-chat-pannel.css',
})
export class AiChatPannelComponent {
  public expanded = false;
}
