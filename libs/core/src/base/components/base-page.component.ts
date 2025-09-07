import {
  Directive,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { injectAppConfig, injectMiniAppConfig } from '@mixcore/app-config';
import { StringHelper } from '@mixcore/helper';
import { BreadcrumbsService } from '@mixcore/ui/breadcrumbs';
import { BaseComponent } from './base.component';

@Directive()
export class BasePageComponent extends BaseComponent {
  @ViewChild('breadcrumb') public breadcrumb?: TemplateRef<HTMLElement>;

  public pageTitle = '';
  public app = injectAppConfig();
  public miniApp = injectMiniAppConfig(true);
  public BASE_APP_NAME =
    this.miniApp?.appDisplayName ||
    this.app.appSetting?.appName ||
    'Mix Portal';

  public breadcrumbService = inject(BreadcrumbsService);
  public viewRef = inject(ViewContainerRef);
  public componentId = StringHelper.generateUUID();

  public ngAfterViewInit() {
    if (this.breadcrumb)
      this.breadcrumbService.add(
        this.componentId,
        this.breadcrumb,
        this.viewRef,
      );
  }

  public ngOnDestroy() {
    document.title = `${this.BASE_APP_NAME}`;

    this.breadcrumbService.remove(this.componentId);
  }

  public ngOnInit(): void {
    if (this.pageTitle) {
      this.setPageTitle(`${this.pageTitle}`);
    } else {
      this.setPageTitle('');
    }
  }

  public setPageTitle(title: string): void {
    document.title = `${this.BASE_APP_NAME} | ${title}`;
  }
}
