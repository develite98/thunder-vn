import {
  Component,
  DestroyRef,
  Inject,
  OnInit,
  Optional,
  Self,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ERROR_MAP, ErrorMap } from '../../config';

@Component({
  selector: 'mix-form-field-error',
  templateUrl: './form-field-error.component.html',
  styles: [],
  imports: [ReactiveFormsModule],
})
export class MixFormFieldErrorComponent
  implements ControlValueAccessor, OnInit
{
  public displayIcon = input<boolean>(true);
  public enableAnimation = input<boolean>(true);
  public customErrorClass = input<string>('');

  public errorMsg = signal<string | null>(null);
  public showIcon = signal<boolean>(true);
  public animate = signal<boolean>(true);
  public destroyRef = inject(DestroyRef);
  public errorMaps: ErrorMap = {};

  constructor(
    @Optional()
    @Self()
    @Inject(NgControl)
    private readonly ngControl: NgControl | null,
    @Inject(ERROR_MAP) public errorMap: ErrorMap[],
  ) {
    if (ngControl && !ngControl.valueAccessor) {
      ngControl.valueAccessor = this;
    }

    this.errorMaps = Object.assign({}, ...(errorMap || []));
    this.showIcon.set(this.displayIcon());
    this.animate.set(this.enableAnimation());
  }

  registerOnChange(): void {
    //
  }

  registerOnTouched(): void {
    //
  }

  setDisabledState(): void {
    //
  }

  writeValue(): void {
    //
  }

  ngOnInit() {
    this.control?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.errorMsg.set(this.computedError);
      });
  }

  get computedError(): string | null {
    return this.invalid && this.touched ? this.error : null;
  }

  private get error(): string | null {
    if (!this.control?.errors) return null;

    const error = Object.keys(this.control?.errors)[0];
    const errorValue = this.control?.errors[error];

    return this.errorMaps[error]
      ? this.errorMaps[error](errorValue)
      : 'Invalid field';
  }

  public get control(): AbstractControl | null {
    return this.ngControl?.control || null;
  }

  public get invalid(): boolean {
    return !!this.control?.invalid;
  }

  public get touched(): boolean {
    return !!this.control?.touched || !!this.control?.dirty;
  }

  public errorClass = computed(() => {
    const baseClasses = 'text-error';
    const iconClasses = this.displayIcon() ? 'flex items-center gap-1' : '';
    const animationClasses = this.enableAnimation()
      ? 'transition-all duration-200 ease-in-out'
      : '';
    const customClasses = this.customErrorClass();

    return [baseClasses, iconClasses, animationClasses, customClasses]
      .filter((cls) => cls)
      .join(' ');
  });
}
