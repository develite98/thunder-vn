import { DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { EMMSBranchDeviceType, IMMSBranchDevice } from '@mixcore/shared-domain';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { DialogService } from '@ngneat/dialog';
import { TippyDirective } from '@ngneat/helipopper';
import { injectDispatch } from '@ngrx/signals/events';
import { DeviceFormComponent } from 'apps/bms-bo/src/components';
import { StoreDeviceListPageEvent } from 'apps/bms-bo/src/state';

@Component({
  selector: 'app-org-chart-node',
  imports: [MixIconComponent, DatePipe, TippyDirective],
  template: `
    <div class="node-content h-full p-4 px-6">
      <div class="w-full h-full flex items-center gap-6">
        @switch (data.typeId) {
          @case (deviceType.Cashier) {
            <img
              src="images/cashier-device.png"
              alt="Cashier Device"
              class="w-[60px] h-auto"
            />
          }
          @case (deviceType.Handy) {
            <img
              src="images/handy-device.png"
              alt="Handy Device"
              class="w-[60px] h-auto"
            />
          }
          @case (deviceType.KitchenPrinter) {
            <img
              src="images/printer-device.png"
              alt="Printer Device"
              class="w-[60px] h-auto"
            />
          }
          @case (deviceType.Printer) {
            <img
              src="images/printer-device.png"
              alt="Printer Device"
              class="w-[60px] h-auto"
            />
          }
          @default {}
        }

        <div class="h-full flex flex-col grow">
          <h4 class="font-bold">{{ data.name }}</h4>
          @if (data.typeId !== deviceType.Root) {
            <div class="text-xs mt-1">{{ data.createdAt | date: 'short' }}</div>
            @if (data.deviceIp) {
              <div class="text-xs">IP: {{ data.deviceIp }}</div>
            }
          } @else {
            <div class="text-xs mt-1">Devices: {{ data['deviceCount'] }}</div>
            <div class="text-xs">POS: {{ data['cashierCount'] }}</div>
            <div class="text-xs">
              Printer: {{ data['kitchenPrinterCount'] }}
            </div>
          }

          <div
            class="mt-auto flex items-center gap-2 pt-2 border-t border-base-content/10"
          >
            @if (data.typeId === deviceType.Cashier) {
              <button
                class="btn btn-xs btn-primary"
                [tp]="tpl"
                [tpDelay]="0"
                [tpVariation]="'popper'"
                [tpTrigger]="'mouseenter'"
                [tpPlacement]="'bottom-start'"
                [tpHideOnClick]="false"
              >
                <mix-icon [size]="12" icon="plus" /> Add
              </button>
            }

            @if (data.typeId !== deviceType.Root) {
              <button
                class="btn btn-xs btn-square  btn-primary"
                (click)="onEdit()"
              >
                <mix-icon [size]="12" icon="pen" />
              </button>

              <button
                class="btn btn-xs btn-square btn-error"
                (click)="onDelete()"
              >
                <mix-icon [size]="12" icon="trash" />
              </button>
            }

            @if (data.typeId === deviceType.Root) {
              <button
                class="btn btn-xs  btn-primary"
                (click)="onCreate(deviceType.Cashier)"
              >
                <mix-icon [size]="12" icon="plus" />

                Cashier
              </button>

              <button
                class="btn btn-xs  btn-primary"
                (click)="onCreate(deviceType.KitchenPrinter)"
              >
                <mix-icon [size]="12" icon="plus" />

                Kitchen printer
              </button>
            }
          </div>
        </div>
      </div>

      <ng-template #tpl let-hide>
        <ul
          class="menu bg-base-100 border border-base-content/10 rounded-box z-1 w-52 p-2 shadow-sm !animate-none !transition-none"
        >
          <li (click)="hide(); onCreate(deviceType.Handy)">
            <a class="w-full flex items-center">
              <mix-icon [size]="12" icon="plus" />
              Handy
            </a>
          </li>

          <li (click)="hide(); onCreate(deviceType.Printer)">
            <a class="w-full flex items-center">
              <mix-icon [size]="12" icon="plus" />
              Printer
            </a>
          </li>
        </ul>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .node-content {
        border: 1px solid #ccc;
        background: white;
        border-radius: 6px;
      }
    `,
  ],
})
export class OrgChartNodeComponent {
  @Input() data!: IMMSBranchDevice;
  @Input() devices: IMMSBranchDevice[] = [];

  public event = injectDispatch(StoreDeviceListPageEvent);
  public dialog = inject(DialogService);
  public modal = injectModalService();

  public deviceType = EMMSBranchDeviceType;

  public onCreate(typeId: EMMSBranchDeviceType = EMMSBranchDeviceType.Cashier) {
    this.dialog.open(DeviceFormComponent, {
      data: {
        typeId,
        storeId: this.data.storeId,
        masterDeviceId: this.data.id === 999 ? null : this.data.id,
        devices: this.devices,
      },
    });
  }

  public onEdit() {
    this.dialog.open(DeviceFormComponent, {
      data: {
        data: this.data,
        isUpdate: true,
        typeId: this.data.typeId,
        storeId: this.data.storeId,
        masterDeviceId: this.data.masterDeviceId,
        devices: this.devices,
      },
    });
  }

  public onDelete() {
    this.modal.asKForAction('', () => {
      this.event.deleted({ data: this.data.id });
    });
  }
}
