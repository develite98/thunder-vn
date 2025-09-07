import { Component, effect, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseComponent } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import {
  BreadcrumbComponent,
  PublicFooterComponent,
  PublicHeaderComponent,
} from '../../components';
import { injectUiConfig } from '../../helper';
import { ISubscriber, subscriberStore } from '../../stores';
import { IStoreConfiguration } from '../../types';

@Component({
  selector: 'mix-contact-page',
  imports: [
    PublicHeaderComponent,
    PublicFooterComponent,
    BreadcrumbComponent,
    ReactiveFormsModule,
    MixButtonComponent,
  ],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent extends BaseComponent {
  public store = inject(subscriberStore);
  public storeConfig = injectUiConfig<IStoreConfiguration>('store-config');
  public sanitizer = inject(DomSanitizer);
  public mapUrl = signal<SafeResourceUrl | null>(null);
  public modal = injectModalService();
  public toast = injectToastService();
  public breadcrumb = [
    {
      label: 'Trang chủ',
      url: '/',
    },
    {
      label: 'Liên hệ',
      url: '/contact',
    },
  ];

  public form = new FormGroup({
    full_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone_number: new FormControl('', Validators.required),
    note: new FormControl('', Validators.required),
  });

  constructor() {
    super();

    effect(() => {
      this.mapUrl.set(
        this.sanitizer.bypassSecurityTrustHtml(
          this.storeConfig()?.embedMap || '',
        ),
      );
    });
  }

  public onSubmit() {
    FormUtils.validateForm$(this.form).then((v) => {
      if (v) {
        this.modal.asKForAction('Xác nhận gửi thông tin liên hệ?', () => {
          this.store
            .createData(this.form.value as unknown as ISubscriber, {
              success: () => {
                this.toast.success(
                  'Gửi thông tin thành công, chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể!',
                );

                this.form.reset();
              },
            })
            .pipe(this.observerLoadingState())
            .subscribe();
        });
      }
    });
  }
}
