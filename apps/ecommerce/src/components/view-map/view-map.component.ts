import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { injectDialogRef } from '@mixcore/ui/dialog';

@Component({
  selector: 'mix-ecom-view-map',
  template: ` <div
    class="w-fit max-w-full h-fit rounded-lg overflow-hidden border border-base-content/10"
    [innerHTML]="mapUrl()"
  ></div>`,
  imports: [],
})
export class ViewEmbedMapComponent {
  public dialogRef = injectDialogRef();
  public santinizer = inject(DomSanitizer);

  public mapUrl = signal(this.dialogRef.data?.map || '');

  constructor() {
    this.mapUrl.set(
      this.santinizer.bypassSecurityTrustHtml(this.dialogRef.data?.map || ''),
    );
  }
}
