/* eslint-disable @typescript-eslint/no-explicit-any */

// cupertino-pane.service.ts
import {
  EmbeddedViewRef,
  inject,
  InjectionToken,
  TemplateRef,
} from '@angular/core';

import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  Type,
} from '@angular/core';

export const BOTTOM_SHEET_REF = new InjectionToken<BottomSheetRef<any>>(
  'BOTTOM_SHEET_REF',
);
export const BOTTOM_SHEET_DATA = new InjectionToken<any>('BOTTOM_SHEET_DATA');

import { Subject } from 'rxjs';
import { CupertinoPane, CupertinoSettings } from '../pane';

export class BottomSheetRef<T = any> {
  private afterClosedSubject = new Subject<T | undefined>();
  afterClosed$ = this.afterClosedSubject.asObservable();

  constructor(
    public pane: CupertinoPane,
    public componentRef: ComponentRef<any>,
    public detach: () => void,
  ) {}

  paneRef() {
    return this.pane;
  }

  close(result?: T, animate = true) {
    this.pane.destroy({ animate });
    if (animate) {
      setTimeout(() => {
        this.afterClosedSubject.next(result);
        this.afterClosedSubject.complete();
      }, 200);
    } else {
      this.afterClosedSubject.next(result);
      this.afterClosedSubject.complete();
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
  ) {}

  open<T>(
    content: Type<T> | TemplateRef<any>,
    options?: Partial<CupertinoSettings>,
    data?: any,
  ): BottomSheetRef<any> {
    let componentRef: ComponentRef<T>;
    let embeddedViewRef: EmbeddedViewRef<any> | null = null;

    const wrapper = document.createElement('div');
    wrapper.classList.add('cupertino-pane-wrapper-container');

    const detach = () => {
      if (componentRef) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }

      if (embeddedViewRef) {
        this.appRef.detachView(embeddedViewRef);
        embeddedViewRef.destroy();
      }

      if (wrapper.parentElement) {
        wrapper.parentElement.removeChild(wrapper);
      }
    };

    const paneRef = new BottomSheetRef<any>(null as any, null as any, detach);
    const customInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: BOTTOM_SHEET_DATA, useValue: data },
        { provide: BOTTOM_SHEET_REF, useValue: paneRef },
      ],
    });

    if (content instanceof TemplateRef) {
      // Create and attach TemplateRef view
      embeddedViewRef = content.createEmbeddedView({ $implicit: data });
      this.appRef.attachView(embeddedViewRef);

      wrapper.appendChild(embeddedViewRef.rootNodes[0] as HTMLElement);
      document.body.appendChild(wrapper);
    } else {
      // Create and attach Component view
      const factory = this.resolver.resolveComponentFactory(content);
      componentRef = factory.create(customInjector);
      this.appRef.attachView(componentRef.hostView);

      wrapper.appendChild(
        (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0],
      );
      document.body.appendChild(wrapper);

      paneRef['componentRef'] = componentRef;
    }

    setTimeout(() => {
      const pane = new CupertinoPane(wrapper, {
        ...options,
        animationType: options?.animationType ?? 'ease',
        animationDuration: options?.animationDuration ?? 200,
        backdrop: options?.backdrop ?? true,
        fitHeight: options?.fitHeight ?? true,
        bottomClose: options?.bottomClose ?? true,
        maxFitHeight: options?.maxFitHeight ?? 620,
        dragBy: options?.dragBy ?? ['.draggable'],
        breaks: options?.breaks ?? {},
        fastSwipeClose: options?.fastSwipeClose ?? true,

        events: {
          ...options?.events,
          onDidDismiss: (ev) => {
            options?.events?.onDidDismiss?.(ev);

            if (componentRef) {
              this.appRef.detachView(componentRef.hostView);
              componentRef.destroy();
            }

            if (embeddedViewRef) {
              this.appRef.detachView(embeddedViewRef);
              embeddedViewRef.destroy();
            }

            if (wrapper.parentElement) {
              wrapper.parentElement.removeChild(wrapper);
            }
          },
        },
      });

      paneRef['pane'] = pane;
      pane.present({ animate: true });
    }, 10);

    return paneRef;
  }
}

export const injectBottomSheet = () => {
  return inject(BottomSheetService);
};
