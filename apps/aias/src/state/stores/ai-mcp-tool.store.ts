import { signalStore, withState } from '@ngrx/signals';

export interface IMCPTool {
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  bestOf?: number;
  stop?: string[];
  user?: string;
  displayName?: string;
  description?: string;
  icon?: string;
  group?: string;
  tools?: IMCPTool[];
  isNew?: boolean;
}

export const AIMcpToolStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(() => ({
    data: <IMCPTool[]>[
      {
        displayName: 'Page',
        tools: [
          {
            displayName: 'Create new page',
            icon: 'plus',
            isNew: true,
          },
          {
            displayName: 'Update a page',
            icon: 'plus',
            isNew: true,
          },
          {
            displayName: `Sumary page's information`,
            icon: 'chart-no-axes-combined',
          },
        ],
      },
      {
        displayName: 'Workplace',
        description: 'Create a blog post about a topic',
        tools: [
          {
            displayName: 'Create new task',
            icon: 'plus',
          },
          {
            displayName: 'Find stale tasks in my workspace',
            icon: 'search',
          },
        ],
      },
      {
        displayName: 'More tools',
        description: 'Create a blog post about a topic',
        tools: [
          {
            displayName: 'Search on the web',
            icon: 'search',
          },
          {
            displayName: 'Ask me anything',
            icon: 'circle-question-mark',
          },
        ],
      },
    ],
  })),
);
