import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectAppConfig } from '@mixcore/app-config';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { AiChatMessageStore, AIMcpToolStore } from '../../state';

@Component({
  selector: 'mix-ai-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, MarkdownModule, MixIconComponent],
  host: {
    class: 'flex flex-col gap-2 grow',
  },
  providers: [provideMarkdown()],
})
export class AIChatMessasageComponent {
  public appConfig = injectAppConfig().appSetting;
  public chatStore = inject(AiChatMessageStore);
  public mcpToolStore = inject(AIMcpToolStore);
}
