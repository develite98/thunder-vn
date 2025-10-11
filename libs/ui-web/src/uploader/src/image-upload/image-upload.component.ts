/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectToastService } from '@mixcore/ui/toast';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'mix-image-upload',
  templateUrl: './image-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImageCropperComponent,
    MixIconComponent,
    MixDialogWrapperComponent,
    MixButtonComponent,
  ],
})
export class MixImageUploadComponent extends BaseComponent {
  public dialogRef = injectDialogRef();

  public imageChangedEvent: Event | null = null;
  public croppedImage = '';
  public croppedImageInfo = signal<ImageCroppedEvent | null>(null);
  public showCropper = false;
  public toast = injectToastService();

  public aspectRatios: {
    label: string;
    value: number;
  }[] = [
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
    { label: 'Custom', value: -1 },
  ];

  public allowedFileTypes: string[] = ['image/*'];
  public maxFileSize: number = 5 * 1024 * 1024;
  public selectedAspectRatio = 1;

  public fileUploadFn?: (file: File) => Promise<string>;
  public base64FileUploadFn?: (content: string) => Promise<string>;

  public get maintainAspectRatio() {
    return this.selectedAspectRatio !== -1;
  }

  public get realAspectRatio() {
    return this.selectedAspectRatio === -1
      ? undefined
      : this.selectedAspectRatio;
  }

  constructor() {
    super();

    this.aspectRatios = this.dialogRef.data?.aspectRatios || this.aspectRatios;
    this.allowedFileTypes =
      this.dialogRef.data?.allowedFileTypes || this.allowedFileTypes;
    this.maxFileSize = this.dialogRef.data?.maxFileSize || this.maxFileSize;
    this.selectedAspectRatio = this.aspectRatios[0].value;

    this.fileUploadFn = this.dialogRef.data?.fileUploadFn;
    this.base64FileUploadFn = this.dialogRef.data?.base64FileUploadFn;
  }

  public fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showCropper = true;
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImageInfo.set(event);
  }

  public dropHandler(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer?.files?.length) {
      const fileEvent = {
        target: {
          files: event.dataTransfer.files,
        },
      };
      this.fileChangeEvent(fileEvent);
    }
  }

  public dragOverHandler(event: DragEvent) {
    event.preventDefault();
  }

  public changeAspectRatio(value: number) {
    this.selectedAspectRatio = value;
    if (value === -1) {
      this.showCropper = false;
    } else {
      this.showCropper = true;
    }
  }

  public reset() {
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.showCropper = false;
  }

  public uploadOriginImage() {
    if (!this.imageChangedEvent || !this.imageChangedEvent.target) {
      return;
    }

    const file = (this.imageChangedEvent.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    if (this.fileUploadFn) {
      this.loadingState.set(LoadingState.Loading);
      this.fileUploadFn(file).then((url) => {
        this.dialogRef.close(url);
        this.loadingState.set(LoadingState.Success);
      });
    } else {
      this.dialogRef.close(URL.createObjectURL(file));
    }
  }

  public uploadCroppedImage() {
    const cropImage = this.croppedImageInfo();
    if (!cropImage) {
      return;
    }

    if (this.fileUploadFn) {
      this.loadingState.set(LoadingState.Loading);
      const file = new File([cropImage.blob as Blob], 'image.png', {
        type: 'image/png',
      });
      this.fileUploadFn(file).then((url) => {
        this.dialogRef.close(url);

        this.loadingState.set(LoadingState.Success);
      });
    } else {
      this.dialogRef.close(this.croppedImage);
    }
  }

  public blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
