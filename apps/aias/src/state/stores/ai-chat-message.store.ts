import { StringHelper } from '@mixcore/helper';
import { indexedDbSignal } from '@mixcore/signal';
import {
  getState,
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ECurrentStreamingMessageState } from '../../types/ai-chat.type';

export interface CurrentStreamingMessage {
  response: string;
  isSuccess: boolean;
  state: ECurrentStreamingMessageState;
}

export interface IMessage {
  response: string;
  isSuccess: boolean;
  id: string;
  date: Date;
  fromAi?: boolean;
  roomId: string;
  createdDate?: Date;
  updatedDate?: Date;
  attachments?: string[];
}

export interface IRoom {
  id: string;
  createdDate: Date;
  updatedDate: Date;
  roomName?: string;
}

export const AiChatMessageStore = signalStore(
  {
    providedIn: 'root',
  },
  withState({
    roomId: '',
    messages: <IMessage[]>[],
    currentStreamingMessage: <CurrentStreamingMessage | null>null,
  }),
  withMethods((store) => ({
    addStreamingMessage: (message: string) => {
      patchState(store, (s) => ({
        ...s,
        currentStreamingMessage: {
          response: (s.currentStreamingMessage?.response || '') + message,
          isSuccess: true,
          state: ECurrentStreamingMessageState.Streaming,
        },
      }));
    },
    addUserMessage: (message: string) => {
      const current = getState(store);

      patchState(store, (s) => ({
        ...s,
        messages: [
          {
            response: message,
            isSuccess: true,
            id: StringHelper.generateUUID(),
            date: new Date(),
            roomId: current.roomId,
          },
          ...s.messages,
        ],
        currentStreamingMessage: {
          response: '',
          isSuccess: true,
          state: ECurrentStreamingMessageState.Initial,
          date: new Date(),
        },
      }));
    },
    completeStreamingMessage: (message: string) => {
      const current = getState(store);
      current.currentStreamingMessage = {
        response: (current?.currentStreamingMessage?.response || '') + message,
        isSuccess: true,
        state: ECurrentStreamingMessageState.Completed,
      };

      patchState(store, (s) => ({
        ...s,
        messages: [
          {
            response: current.currentStreamingMessage?.response || '',
            isSuccess: true,
            id: StringHelper.generateUUID(),
            date: new Date(),
            fromAi: true,
            roomId: current.roomId,
          },
          ...s.messages,
        ],
        currentStreamingMessage: null,
      }));
    },
    clearMessages: () => {
      patchState(store, (s) => ({
        ...s,
        messages: [],
        currentStreamingMessage: null,
      }));
    },
  })),
);

export const TestMessageStore = signalStore(
  {
    providedIn: 'root',
  },
  indexedDbSignal<IMessage>({
    dbName: 'AiChatMessages',
    attribute: 'id++',
  }),
);

export const TestRoomStore = signalStore(
  {
    providedIn: 'root',
  },
  indexedDbSignal<IRoom>({
    dbName: 'AiChatRoooms',
    attribute: 'id',
  }),
  withMethods((store) => ({
    newRoom: (roomName: string) => {
      store.addData({
        id: StringHelper.generateUUID(),
        roomName: roomName,
        createdDate: new Date(),
        updatedDate: new Date(),
      });
    },
  })),
);
