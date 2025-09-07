import { inject } from '@angular/core';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import {
  getState,
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { IHubInfo } from '../../types/ai-chat.type';
import {
  AiChatMessageStore,
  CurrentStreamingMessage,
} from './ai-chat-message.store';

export const AiChatHubStore = signalStore(
  {
    providedIn: 'root',
  },
  withState({
    hub: <IHubInfo | null>null,
  }),
  withMethods(
    (
      store,
      client = injectMixClient(),
      messageStore = inject(AiChatMessageStore),
    ) => ({
      connect: (force?: boolean) => {
        const current = getState(store);
        if (!force && current.hub) return;

        const { connection, postMessage, disconnect } =
          client.hub.subscribe<CurrentStreamingMessage>(
            'llm_chat',
            (message) => {
              if (message.action === 'NewStreamingMessage') {
                messageStore.addStreamingMessage(message.data.response);
              }

              if (message.action === 'NewMessage') {
                messageStore.completeStreamingMessage(message.data.response);
              }
            },
          );

        patchState(store, (s) => ({
          ...s,
          hub: { connection, postMessage, disconnect },
        }));
      },
      askAi: async (message: string) => {
        const current = getState(store);
        if (!current.hub) return;

        messageStore.addUserMessage(message);
        current.hub.postMessage('askAi', message).catch(() => {
          //
        });
      },
      disconnect: () => {
        const current = getState(store);
        if (current.hub) {
          current.hub.connection.stop();
          patchState(store, (s) => ({
            ...s,
            hub: null,
          }));
        }
      },
    }),
  ),
);
