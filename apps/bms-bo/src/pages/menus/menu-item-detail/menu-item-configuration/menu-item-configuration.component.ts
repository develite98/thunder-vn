import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { MixFormComponent } from '@mixcore/ui/forms';
import { MixMenuScrollspyComponent } from '@mixcore/ui/menu-scrollspy';
import { MenuItemStore } from '../../../../state';

@Component({
  selector: 'bms-menu-item-configuration-page',
  templateUrl: './menu-item-configuration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixFormComponent, MixDeleteComponent, MixMenuScrollspyComponent],
})
export class MenuItemConfigurationPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(MenuItemStore);
  readonly router = injectMiniAppRouter();

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  public form = new FormGroup({});
  public fields = computed(() => {
    return [
      {
        key: 'name',
        type: 'input',
        props: {
          label: 'bms.menuItem.displayName',
          placeholder: 'common.input.placeholder',
          description: 'bms.menuItem.displayNameDescription',
        },
      },
      {
        key: 'receiptName',
        type: 'input',
        props: {
          label: 'bms.menuItem.receiptName',
          placeholder: 'common.input.placeholder',
          description: 'bms.menuItem.receiptNameDescription',
        },
      },
      {
        key: 'kitchenName',
        type: 'input',
        props: {
          label: 'bms.menuItem.kitchenName',
          placeholder: 'common.input.placeholder',
          description: 'bms.menuItem.kitchenNameDescription',
        },
      },
    ];
  });

  public scrollSpyItems = [
    {
      id: 'form-item-name',
      label: 'Name',
    },
    {
      id: 'form-item-receiptName',
      label: 'Receipt name',
    },
    {
      id: 'form-item-kitchenName',
      label: 'Kitchen name',
    },
    {
      id: 'menu-item-delete',
      label: 'Delete',
      labelClass: '!text-error',
    },
  ];
}
