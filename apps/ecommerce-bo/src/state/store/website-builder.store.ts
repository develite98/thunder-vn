import { createFromMixDb } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { IFormConfig } from '@mixcore/ui/forms';
import { signalStore } from '@ngrx/signals';

export interface IWebsiteBuilder {
  created_by: string;
  id: number;
  value: {
    data: any;
  };
  key: string;
  description: string;
  status: string;
  created_date_time: string;
  form_schema: {
    formConfig: IFormConfig[];
  };
}

export const WebsiteBuilderStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IWebsiteBuilder>({
    apiFactory: createFromMixDb('mix_website_builder'),
  }),
);
