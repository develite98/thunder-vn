import { DatePipe, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { DialogService } from '@ngneat/dialog';
import { injectDispatch } from '@ngrx/signals/events';
import { DeviceFormComponent } from 'apps/bms-bo/src/components';
import {
  BranchDeviceStore,
  BranchStore,
  StoreDeviceListPageEvent,
} from 'apps/bms-bo/src/state';

import {
  EMMSBranchDeviceType,
  EMMSBranchDeviceTypeName,
  IMMSBranchDevice,
} from '@mixcore/shared-domain';

import { explicitEffect } from 'ngxtension/explicit-effect';

interface IHierarchicalDevice extends IMMSBranchDevice {
  _level?: number;
  _parentName?: string;
  _deviceIcon?: string;
  _hasChildren?: boolean;
  _isParent?: boolean;
  _isChild?: boolean;
  _parentId?: number;
}

interface IDeviceGroup {
  parent: IHierarchicalDevice;
  children: IHierarchicalDevice[];
}

@Component({
  selector: 'app-store-devices-table-page',
  templateUrl: './store-devices-table.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixTableModule,
    MixButtonComponent,
    MixIconComponent,
    MixCopyTextComponent,
    DatePipe,
    UpperCasePipe,
    TranslocoPipe,
  ],
})
export class StoreDevicesTablePage extends BasePageComponent {
  public branchStore = inject(BranchStore);
  public branchDeviceStore = inject(BranchDeviceStore);
  public modal = injectModalService();
  public dialog = inject(DialogService);
  public event = injectDispatch(StoreDeviceListPageEvent);

  public branchId = injectParams('id');
  public branch = this.branchStore.selectEntityById(this.branchId);

  public readonly EMMSBranchDeviceType = EMMSBranchDeviceType;

  public readonly contextMenu: GridContextMenu<IMMSBranchDevice>[] = [
    {
      label: 'bms.device.addHandy',
      icon: 'smartphone',
      action: (item) => this.onCreate(EMMSBranchDeviceType.Handy, item.id),
      visible: (item) => item.typeId === EMMSBranchDeviceType.Cashier,
    },
    {
      label: 'bms.device.addPrinter',
      icon: 'printer',
      action: (item) => this.onCreate(EMMSBranchDeviceType.Printer, item.id),
      visible: (item) => item.typeId === EMMSBranchDeviceType.Cashier,
    },
    {
      label: 'common.edit',
      icon: 'pencil',
      action: (item) => this.editDevice(item),
      visible: () => true,
    },
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.deleteDevice(item),
      visible: () => true,
      iconClass: 'text-error',
    },
  ];

  public hierarchicalDevices = computed(() => {
    const devices = this.branchDeviceStore.dataEntities();

    if (!devices.length) return [];

    const cashierDevices = devices.filter(
      (d) => d.typeId === EMMSBranchDeviceType.Cashier,
    );
    const kitchenPrinters = devices.filter(
      (d) => d.typeId === EMMSBranchDeviceType.KitchenPrinter,
    );
    const handyDevices = devices.filter(
      (d) => d.typeId === EMMSBranchDeviceType.Handy,
    );
    const printerDevices = devices.filter(
      (d) => d.typeId === EMMSBranchDeviceType.Printer,
    );

    const parentGroups: IDeviceGroup[] = [];

    cashierDevices.forEach((pos) => {
      const posHandies = handyDevices.filter(
        (h) => h.masterDeviceId === pos.id,
      );
      const posPrinters = printerDevices.filter(
        (p) => p.masterDeviceId === pos.id,
      );

      const children = [...posHandies, ...posPrinters].map(
        (child): IHierarchicalDevice => ({
          ...child,
          _level: 1,
          _parentName: pos.name,
          _deviceIcon:
            child.typeId === EMMSBranchDeviceType.Handy
              ? 'smartphone'
              : 'printer',
        }),
      );

      parentGroups.push({
        parent: {
          ...pos,
          _level: 0,
          _deviceIcon: 'monitor',
          _hasChildren: children.length > 0,
        },
        children: children,
      });
    });

    kitchenPrinters.forEach((printer) => {
      parentGroups.push({
        parent: {
          ...printer,
          _level: 0,
          _deviceIcon: 'printer',
        },
        children: [],
      });
    });

    const entityMap = this.branchDeviceStore.dataEntityMap();
    const standalonePrinters = printerDevices.filter(
      (p) =>
        !p.masterDeviceId ||
        !entityMap[p.masterDeviceId] ||
        entityMap[p.masterDeviceId].typeId !== EMMSBranchDeviceType.Cashier,
    );
    const standaloneHandies = handyDevices.filter(
      (h) =>
        !h.masterDeviceId ||
        !entityMap[h.masterDeviceId] ||
        entityMap[h.masterDeviceId].typeId !== EMMSBranchDeviceType.Cashier,
    );

    [...standalonePrinters, ...standaloneHandies].forEach((device) => {
      parentGroups.push({
        parent: {
          ...device,
          _level: 0,
          _deviceIcon:
            device.typeId === EMMSBranchDeviceType.Handy
              ? 'smartphone'
              : 'printer',
        },
        children: [],
      });
    });

    const hierarchicalData: IHierarchicalDevice[] = [];
    parentGroups.forEach((group) => {
      hierarchicalData.push({
        ...group.parent,
        _isParent: true,
      });

      group.children.forEach((child) => {
        hierarchicalData.push({
          ...child,
          _isChild: true,
          _parentId: group.parent.id,
        });
      });
    });

    return hierarchicalData;
  });

  constructor() {
    super();

    explicitEffect([this.branch], ([branch]) => {
      if (!branch) return;

      this.branchDeviceStore
        .search(
          new MixQuery().default(100).inRange('StoreId', branch.id.toString()),
        )
        .subscribe();
    });
  }

  public getDeviceTypeName(typeId: EMMSBranchDeviceType): string {
    return EMMSBranchDeviceTypeName[typeId] || 'Unknown';
  }
  // Create a computed signal for the lookup map
  public deviceNameMap = computed(() => {
    const entityMap = this.branchDeviceStore.dataEntityMap();
    return (masterDeviceId: number | null) => {
      if (!masterDeviceId) return '-';
      return entityMap[masterDeviceId]?.name || 'Unknown';
    };
  });

  public getMasterDeviceName(device: IMMSBranchDevice): string {
    if (!device.masterDeviceId) return '-';
    return (
      this.branchDeviceStore.dataEntityMap()[device.masterDeviceId]?.name ||
      'Unknown'
    );
  }

  public refreshDevices() {
    const branch = this.branch();
    if (branch) {
      this.branchDeviceStore
        .search(
          new MixQuery().default(100).inRange('StoreId', branch.id.toString()),
        )
        .subscribe();
    }
  }

  public getDeviceIcon(device: IHierarchicalDevice): string {
    return device._deviceIcon || 'monitor';
  }

  public getHierarchyClass(device: IHierarchicalDevice): string {
    const level = device._level || 0;
    if (level === 0) {
      return '';
    } else {
      return 'pl-6 ml-2 relative border-l border-base-content/20';
    }
  }

  public getIconClass(): string {
    return 'w-4 h-4 text-base-content/70';
  }

  public onCreate(
    typeId: EMMSBranchDeviceType,
    masterDeviceId?: number | null,
  ) {
    const branch = this.branch();
    if (!branch) return;

    this.dialog.open(DeviceFormComponent, {
      data: {
        typeId,
        storeId: branch.id,
        masterDeviceId: masterDeviceId || null,
        devices: this.branchDeviceStore.dataEntities(),
      },
    });
  }

  public editDevice(device: IMMSBranchDevice) {
    this.dialog.open(DeviceFormComponent, {
      data: {
        data: device,
        isUpdate: true,
        typeId: device.typeId,
        storeId: device.storeId,
        masterDeviceId: device.masterDeviceId,
        devices: this.branchDeviceStore.dataEntities(),
      },
    });
  }

  public deleteDevice(device: IMMSBranchDevice) {
    this.modal.asKForAction(
      this.translate('bms.device.deleteConfirmation'),
      () => {
        this.event.deleted({ data: device.id });
      },
    );
  }
}
