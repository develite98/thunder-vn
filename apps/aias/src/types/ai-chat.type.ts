import { HubConnection } from '@microsoft/signalr';

export enum ECurrentStreamingMessageState {
  Initial = 'initial',
  Streaming = 'streaming',
  Completed = 'completed',
}

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
}

export interface IHubInfo {
  connection: HubConnection;
  postMessage(methodName: string, ...args: any[]): Promise<any>;
  disconnect(): Promise<void>;
}
