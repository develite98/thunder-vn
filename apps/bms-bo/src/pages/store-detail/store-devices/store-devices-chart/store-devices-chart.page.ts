import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  computed,
  createComponent,
  ElementRef,
  EnvironmentInjector,
  inject,
  NgZone,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { BranchDeviceStore, BranchStore } from 'apps/bms-bo/src/state';

import {
  EMMSBranchDeviceType,
  generateBranchMasterDevice,
  IBranch,
  IMMSBranchDevice,
} from '@mixcore/shared-domain';
import { OrgChart } from 'd3-org-chart';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { OrgChartNodeComponent } from './node.component';

@Component({
  selector: 'app-store-devices-chart-page',
  templateUrl: './store-devices-chart.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslocoPipe],
})
export class StoreDevicesChartPage extends BasePageComponent implements AfterViewInit {
  chartContainer = viewChild<ElementRef>('chartContainer');

  public branchStore = inject(BranchStore);
  public branchDeviceStore = inject(BranchDeviceStore);

  public deviceEntityMap = computed(() => this.branchDeviceStore.dataEntityMap());

  public deviceTypeGroups = computed(() => {
    const devices = this.branchDeviceStore.dataEntities();
    if (!devices.length) {
      return {
        cashiers: [],
        kitchenPrinters: [],
        handies: [],
        printers: [],
      };
    }

    const cashiers: IMMSBranchDevice[] = [];
    const kitchenPrinters: IMMSBranchDevice[] = [];
    const handies: IMMSBranchDevice[] = [];
    const printers: IMMSBranchDevice[] = [];

    devices.forEach((device) => {
      switch (device.typeId) {
        case EMMSBranchDeviceType.Cashier:
          cashiers.push(device);
          break;
        case EMMSBranchDeviceType.KitchenPrinter:
          kitchenPrinters.push(device);
          break;
        case EMMSBranchDeviceType.Handy:
          handies.push(device);
          break;
        case EMMSBranchDeviceType.Printer:
          printers.push(device);
          break;
      }
    });

    return { cashiers, kitchenPrinters, handies, printers };
  });
  private environmentInjector = inject(EnvironmentInjector);
  private appRef = inject(ApplicationRef);

  public zone = inject(NgZone);
  public branchId = injectParams('id');
  public branch = this.branchStore.selectEntityById(this.branchId);

  public chart: OrgChart<IMMSBranchDevice> | undefined = undefined;
  public rendingChart = false;

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

    explicitEffect(
      [this.branch, this.branchDeviceStore.dataEntities],
      ([branch, devices]) => {
        if (branch && devices.length > 0) {
          this.renderChartWhenReady(branch, devices);
        }
      },
    );
  }

  override ngAfterViewInit() {
    const branch = this.branch();
    const devices = this.branchDeviceStore.dataEntities();
    if (branch && devices.length > 0) {
      this.renderChartWhenReady(branch, devices);
    }
  }

  private renderChartWhenReady(branch: IBranch, devices: IMMSBranchDevice[]) {
    const chartContainer = this.chartContainer();
    if (chartContainer) {
      this.zone.runOutsideAngular(() => {
        this.renderChart(branch, devices);
      });
    }
  }

  public renderChart(branch: IBranch, devices: IMMSBranchDevice[] = []) {
    this.rendingChart = true;

    const deviceGroups = this.deviceTypeGroups();
    const entityMap = this.deviceEntityMap();

    const cashier = deviceGroups.cashiers.map((x) => ({
      ...x,
      parentId: 999,
    }));

    const kitchenPrinters = deviceGroups.kitchenPrinters.map((printer) => ({
      ...printer,
      parentId: 999,
    }));

    const handies = deviceGroups.handies.map((handy) => {
      const masterDevice = handy.masterDeviceId ? entityMap[handy.masterDeviceId] : null;
      return {
        ...handy,
        parentId: masterDevice?.id || cashier[0]?.id || 999,
      };
    });

    const printers = deviceGroups.printers.map((printer) => {
      const masterDevice = printer.masterDeviceId ? entityMap[printer.masterDeviceId] : null;
      return {
        ...printer,
        parentId: masterDevice?.id || cashier[0]?.id || 999,
      };
    });

    const masterNode = generateBranchMasterDevice(branch);
    masterNode['deviceCount'] = devices.length;
    masterNode['cashierCount'] = cashier.length;
    masterNode['kitchenPrinterCount'] = kitchenPrinters.length;

    const chartContainer = this.chartContainer();
    if (!chartContainer) return;

    this.chart = new OrgChart<IMMSBranchDevice>()
      .container(chartContainer.nativeElement)
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
          const componentRef = createComponent(OrgChartNodeComponent, {
            environmentInjector: this.environmentInjector,
          });
          componentRef.setInput('data', d.data);
          componentRef.setInput('devices', devices);

          this.appRef.attachView(componentRef.hostView);
          container.appendChild(componentRef.location.nativeElement);
        }
      });

    this.chart.render().expandAll();

    setTimeout(() => {
      this.rendingChart = false;
    }, 500);
  }
}
