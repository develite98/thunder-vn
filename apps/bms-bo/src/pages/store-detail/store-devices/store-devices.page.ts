import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  effect,
  ElementRef,
  inject,
  Injector,
  NgZone,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { injectDispatch } from '@ngrx/signals/events';
import {
  BranchDeviceStore,
  BranchStore,
  StoreDeviceListPageEvent,
} from 'apps/bms-bo/src/state';

import {
  EMMSBranchDeviceType,
  generateBranchMasterDevice,
  IBranch,
  IMMSBranchDevice,
} from '@mixcore/shared-domain';
import { OrgChart } from 'd3-org-chart';
import { OrgChartNodeComponent } from './node.component';

@Component({
  selector: 'app-store-devices-page',
  templateUrl: './store-devices.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./store-devices.page.css'],
  imports: [],
})
export class StoreDevicesPage extends BasePageComponent {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  public event = injectDispatch(StoreDeviceListPageEvent);

  public branchStore = inject(BranchStore);
  public branchDeviceStore = inject(BranchDeviceStore);
  public zone = inject(NgZone);
  public branchId = injectParams('id');
  public branch = this.branchStore.selectEntityById(this.branchId);

  public chart: OrgChart<IMMSBranchDevice> | undefined = undefined;
  public rendingChart = false;

  constructor(
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
  ) {
    super();

    effect(() => {
      const branch = this.branch();
      if (!branch) return;

      this.event.pageOpened(
        new MixQuery().default(100).inRange('StoreId', branch.id.toString()),
      );
    });

    effect(() => {
      const branch = this.branch();
      const devices = this.branchDeviceStore.dataEntities();
      if (branch) {
        this.zone.runOutsideAngular(() => {
          this.renderChart(branch, devices);
        });
      }
    });
  }

  renderChart(branch: IBranch, devices: IMMSBranchDevice[] = []) {
    this.rendingChart = true;

    const cashier = devices
      .filter((item) => item.typeId === EMMSBranchDeviceType.Cashier)
      .map((x) => {
        return {
          ...x,
          parentId: 999,
        };
      });

    const kitchenPrinters = devices
      .filter((item) => item.typeId === EMMSBranchDeviceType.KitchenPrinter)
      .map((printer) => {
        return {
          ...printer,
          parentId: 999,
        };
      });

    const handies = devices
      .filter((item) => item.typeId === EMMSBranchDeviceType.Handy)
      .map((handy) => {
        return {
          ...handy,
          parentId:
            cashier.find((cashier) => handy.masterDeviceId === cashier.id)
              ?.id ||
            cashier[0]?.id ||
            999,
        };
      });

    const printers = devices
      .filter((item) => item.typeId === EMMSBranchDeviceType.Printer)
      .map((printer) => {
        return {
          ...printer,
          parentId:
            cashier.find((cashier) => printer.masterDeviceId === cashier.id)
              ?.id ||
            cashier[0]?.id ||
            999,
        };
      });

    const masterNode = generateBranchMasterDevice(branch);
    masterNode['deviceCount'] = devices.length;
    masterNode['cashierCount'] = cashier.length;
    masterNode['kitchenPrinterCount'] = kitchenPrinters.length;

    this.chart = new OrgChart<IMMSBranchDevice>()
      .container(this.chartContainer.nativeElement)
      .data([
        masterNode,
        ...cashier,
        ...kitchenPrinters,
        ...printers,
        ...handies,
      ])
      .nodeHeight(() => 140)
      .nodeWidth(() => 300)
      .childrenMargin(() => 60)
      .compactMarginBetween(() => 15)
      .compactMarginPair(() => 60)
      .nodeContent((d: any) => {
        const id = d.data.id;
        return `<div id="angular-node-${id}" style="width:100%;height:100%"></div>`;
      })
      .nodeUpdate((d: any) => {
        const id = d.data.id;
        const container = document.getElementById(`angular-node-${id}`);
        if (container && !container.hasChildNodes()) {
          const factory = this.resolver.resolveComponentFactory(
            OrgChartNodeComponent,
          );
          const componentRef = factory.create(this.injector);
          componentRef.instance.data = d.data;
          componentRef.instance.devices = devices;

          this.appRef.attachView(componentRef.hostView);
          container.appendChild((componentRef.hostView as any).rootNodes[0]);
        }
      });

    this.chart.render().expandAll();

    setTimeout(() => {
      this.rendingChart = false;
    }, 500);
  }
}
