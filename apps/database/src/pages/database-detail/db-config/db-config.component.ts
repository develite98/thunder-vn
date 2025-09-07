import { Component, effect, inject } from '@angular/core';
import { injectParams } from '@mixcore/router';
import { IFormConfig, MixFormComponent } from '@mixcore/ui/forms';
import { injectDispatch } from '@ngrx/signals/events';

import { FormGroup } from '@angular/forms';
import { MixDatabase } from '@mixcore/sdk-client';
import { injectModalService } from '@mixcore/ui/modal';

import { clone } from 'lodash';
import { databasePageEvents, DatabaseStore } from '../../../state';

import { MixDeleteComponent } from '@mixcore/ui/delete';

@Component({
  selector: 'app-db-config',
  imports: [MixFormComponent, MixDeleteComponent],
  templateUrl: './db-config.component.html',
})
export class DbConfigComponent {
  readonly dbId = injectParams('databaseId');
  readonly dbStore = inject(DatabaseStore);
  readonly dispatch = injectDispatch(databasePageEvents);
  readonly modal = injectModalService();

  public data = this.dbStore.selectEntityById(this.dbId);

  public value: Partial<MixDatabase> = {};
  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'displayName',
      type: 'input',
      props: {
        label: 'database.input.displayName.label',
        placeholder: 'database.input.displayName.placeholder',
        description: '',
        required: true,
      },
    },
    {
      key: 'connectionString',
      type: 'textarea',
      props: {
        label: 'database.input.connectionString.label',
        placeholder: 'database.input.connectionString.placeholder',
        description:
          'A database connection string defines how to connect to a database, including the host, port, database name, username, and password.',
        required: true,
      },
    },
    {
      key: 'description',
      type: 'editor',
      props: {
        label: 'database.input.connectionString.label',
        placeholder: 'database.input.connectionString.placeholder',
        description:
          'A database connection string defines how to connect to a database, including the host, port, database name, username, and password.',
        required: true,
      },
    },
  ];

  constructor() {
    effect(() => {
      const db = this.data();
      if (!db) return;

      this.value = clone(db);
    });
  }

  public onDelete() {
    this.modal.asKForAction('asd', () => {});
  }
}
